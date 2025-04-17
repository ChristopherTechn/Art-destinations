const axios = require("axios");
require("dotenv").config();

async function listAvailableModels() {
    try {
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
        );
        console.log("Available models:", response.data);
    } catch (error) {
        console.error("Error fetching available models:", error.response?.data || error.message);
    }
}

listAvailableModels();
