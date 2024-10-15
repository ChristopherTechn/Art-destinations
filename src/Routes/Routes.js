// src/routes/adminroutes.js
const express = require('express');

const verifyToken = require('../Middleware/authMiddleware'); // Import the verifyToken middleware
const { showcaseArts } = require('../Controllers/Showart'); 
const Addart = require('../Controllers/Addart');

const router = express.Router();

// Apply the verifyToken middleware to routes that need token validation
router.get('/arts', verifyToken, showcaseArts); // Add verifyToken here
router.post('/Addart', verifyToken, Addart); // Add verifyToken here too

module.exports = router;
