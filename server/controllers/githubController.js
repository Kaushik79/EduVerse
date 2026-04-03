const axios = require('axios');
const { User } = require('../models');

const githubController = {
  async getRepos(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user || !user.accessToken) {
        return res.status(401).json({ message: 'GitHub access token not found for user' });
      }

      const response = await axios.get('https://api.github.com/user/repos?sort=updated&per_page=10', {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      const repos = response.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language
      }));

      res.json(repos);
    } catch (error) {
      console.error('Error fetching github repos:', error);
      res.status(500).json({ message: 'Failed to fetch repositories', error: error.message });
    }
  },

  async analyzeCommits(req, res) {
    try {
      const { repoName } = req.body;
      if (!repoName) return res.status(400).json({ message: 'Repo name required' });

      const user = await User.findByPk(req.user.id);
      if (!user || !user.accessToken) {
        return res.status(401).json({ message: 'GitHub access token not found' });
      }

      // Fetch latest commits
      const commitsResponse = await axios.get(`https://api.github.com/repos/${user.username}/${repoName}/commits?per_page=5`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      const commits = commitsResponse.data;

      // Fetch files/patch for each commit
      const commitDetails = await Promise.all(commits.map(async (commitItem) => {
        const commitRes = await axios.get(`https://api.github.com/repos/${user.username}/${repoName}/commits/${commitItem.sha}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });
        
        const filesChanged = commitRes.data.files ? commitRes.data.files.map(file => ({
          filename: file.filename,
          additions: file.additions,
          deletions: file.deletions,
          patch: file.patch
        })) : [];

        return {
          sha: commitItem.sha,
          message: commitItem.commit.message,
          author: commitItem.commit.author.name,
          date: commitItem.commit.author.date,
          filesChanged
        };
      }));

      res.json(commitDetails);
    } catch (error) {
      console.error('Error analyzing commits:', error.response?.data || error.message);
      res.status(500).json({ message: 'Failed to analyze commits', error: error.message });
    }
  }
};

module.exports = githubController;
