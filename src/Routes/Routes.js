// src/routes/adminroutes.js
const express = require('express');
const verifyToken = require('../Middleware/authMiddleware'); // Import the verifyToken middleware
const { showcaseArts, getArtworkById } = require('../Controllers/Showart'); 
const { addArt, deleteImage } = require('../Controllers/Addart'); // Updated import with both functions
const { getArticles, addArticle } = require('../Controllers/Articles');
const { showDestinations } = require('../Controllers/Destination'); 
const router = express.Router();
const {createBooking} = require('../Controllers/Bookings'); 

router.get('/arts', showcaseArts); 
router.post('/addart', verifyToken, addArt); 
router.delete('/images/:image_id', verifyToken, deleteImage);
 router.get('/article', getArticles); // Public route
router.post('/addarticle', verifyToken, addArticle);
router.get('/arts/:id', verifyToken, getArtworkById);
router.get('/destination', showDestinations);
router.post('/bookings', verifyToken, createBooking); // Ensure this route is protected

module.exports = router;