const express = require('express');
const router = express.Router();
const { chatbotResponse  } = require('../Controllers/Chatbot');

router.post('/', chatbotResponse);

module.exports = router;
