const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY;
    const response = await fetch(url);
    const data = await response.json();
    if(data.error) {
       console.log("ERROR JSON", data.error);
       return;
    }
    const modelNames = data.models.map(m => m.name.replace('models/', ''));
    console.log("AVAILABLE MODELS:", modelNames.join(", "));
  } catch (e) {
    console.error("FETCHER ERROR:", e);
  }
}
run();
