const { getChatbotResponse } = require("../utils/chatbot");

exports.chatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await getChatbotResponse(message);
        res.json({ response });

    } catch (error) {
        console.error("Error in chatbotResponse:", error);
        res.status(500).json({ error: "Server error: " + error.message });
    }
};
