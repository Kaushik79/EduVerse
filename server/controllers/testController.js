const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const { Test, User } = require('../models');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const testController = {
  async generateTest(req, res) {
    try {
      const { repoName } = req.body;
      if (!repoName) return res.status(400).json({ message: 'Repo name required' });

      const user = await User.findByPk(req.user.id);
      if (!user || !user.accessToken) {
        return res.status(401).json({ message: 'GitHub access token not found' });
      }

      // Check if a PENDING test already exists for this repo/user pair
      let existingTest = await Test.findOne({
        where: { userId: user.id, repoName, status: 'PENDING' }
      });

      if (existingTest) {
        return res.json({ testId: existingTest.id, challengeData: existingTest.challengeData });
      }

      // Fetch latest commits
      const commitsResponse = await axios.get(`https://api.github.com/repos/${user.username}/${repoName}/commits?per_page=5`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      const commits = commitsResponse.data;
      let allPatches = '';

      for (let commitItem of commits) {
        const commitRes = await axios.get(`https://api.github.com/repos/${user.username}/${repoName}/commits/${commitItem.sha}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });
        
        if (commitRes.data.files) {
          commitRes.data.files.forEach(file => {
            if (file.patch) {
              allPatches += `\nFilename: ${file.filename}\nPatch:\n${file.patch}\n---\n`;
            }
          });
        }
      }

      if (!allPatches) {
        return res.status(400).json({ message: 'No code patches found in recent commits to analyze.' });
      }

      // Feed patches to Gemini
      const prompt = `
        You are a computer science professor. Analyze the following GitHub commit patches for a student's project.
        Create a "Code Reconstruction" challenge. Pick 1 significant contiguous code block from the patches. 
        Return a JSON object STRICTLY matching this structure, with no markdown codeblock wrapping or extra text:
        {
          "filename": "The name of the file",
          "language": "The programming language",
          "codeWithGaps": "The original code snippet, but replace exactly 1 critical logical block (2-4 lines) with the exact string '___GAP___'",
          "correctSnippet": "The exact original string of code that belongs in the gap",
          "hint": "A short hint explaining what logic is missing"
        }

        Commits Data:
        ${allPatches.substring(0, 15000)}
      `;

      let result;
      let generateSuccess = false;
      let lastError = null;

      const attemptGeneration = async (modelName, maxRetries) => {
        const model = genAI.getGenerativeModel({ model: modelName });
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            result = await model.generateContent(prompt);
            return true;
          } catch (err) {
            lastError = err;
            console.error(`Attempt ${attempt} with ${modelName} failed:`, err.message);
            if (attempt < maxRetries) {
              const waitTime = Math.pow(2, attempt - 1) * 1000;
              await new Promise(res => setTimeout(res, waitTime));
            }
          }
        }
        return false;
      };

      generateSuccess = await attemptGeneration("gemini-2.5-flash-lite", 3);
      
      if (!generateSuccess) {
        console.log("Fallback: trying gemini-2.5-flash...");
        generateSuccess = await attemptGeneration("gemini-2.5-flash", 1);
      }

      if (!generateSuccess) {
        return res.status(503).json({ message: "Service Unavailable: Failed to generate AI test after multiple attempts. Please try again later." });
      }

      const responseText = result.response.text();
      
      let challengeData;
      try {
        let cleaned = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
        challengeData = JSON.parse(cleaned);
        
        if (!challengeData.codeWithGaps || !challengeData.correctSnippet) {
          throw new Error("Missing required schema constraints (codeWithGaps or correctSnippet)");
        }
      } catch (e) {
        console.error("Failed to parse Gemini JSON:", responseText, e);
        return res.status(500).json({ message: 'Failed to generate an AI challenge correctly. Please Try Again.' });
      }

      const newTest = await Test.create({
        userId: user.id,
        repoName,
        challengeType: 'Code Reconstruction',
        challengeData,
        status: 'PENDING'
      });

      res.json({ testId: newTest.id, challengeData: newTest.challengeData });

    } catch (error) {
      console.error('Error generating AI test:', error);
      res.status(500).json({ message: 'Failed to generate test', error: error.message });
    }
  },

  async submitTest(req, res) {
    try {
      const { testId, studentAnswer } = req.body;
      
      const test = await Test.findByPk(testId);
      if (!test || test.userId !== req.user.id) {
        return res.status(404).json({ message: 'Test not found' });
      }

      if (test.status === 'COMPLETED') {
        return res.status(400).json({ message: 'Test already completed' });
      }

      const correctSnippet = test.challengeData.correctSnippet;
      
      // Simple comparative grading loop
      const normalizedAnswer = studentAnswer.replace(/\s+/g, '').trim();
      const normalizedCorrect = correctSnippet.replace(/\s+/g, '').trim();

      let score = 0;
      if (normalizedAnswer === normalizedCorrect) {
         score = 100;
      } else if (normalizedCorrect.includes(normalizedAnswer) && normalizedAnswer.length > 5) {
         score = 50;
      }

      await test.update({
        studentAnswer,
        score,
        status: 'COMPLETED'
      });

      res.json({ message: 'Test submitted completely', score, correctSnippet });

    } catch (error) {
      console.error('Error grading test:', error);
      res.status(500).json({ message: 'Failed to submit test', error: error.message });
    }
  }
};

module.exports = testController;
