const axios = require("axios");
const FAQ = require("../Models/FAQ");
require("dotenv").config();

async function getChatbotResponse(userMessage) {
    try {
        // Check if the question exists in the FAQ database first
        const results = await FAQ.searchByKeyword(userMessage);
        if (results.length > 0) {
            return results[0].answer; // Return predefined FAQ answer
        }

        // If not found, send query to Google Gemini AI
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent
`,  // ✅ Updated model name
            {
                contents: [{ role: "user", parts: [{ text: userMessage }] }],
            },
            {
                headers: { "Content-Type": "application/json" },
                params: { key: process.env.GEMINI_API_KEY }, // Use Google API Key
            }
        );

        // Extract AI-generated response
        return response.data.candidates[0]?.content?.parts[0]?.text || "I'm sorry, I couldn't find an answer.";

    } catch (error) {
        console.error("Error generating chatbot response:", error.response?.data || error.message);
        return "An error occurred while processing your request.";
    }
}

module.exports = { getChatbotResponse };
