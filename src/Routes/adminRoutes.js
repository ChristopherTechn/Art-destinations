const express = require('express');
const { registerUser, confirmUser } = require('../Controllers/registerController'); // Import both functions
const {loginUser} = require('../Controllers/loginController')

const router = express.Router();

// Route to register a user
router.post('/register', registerUser); // Call the function directly

// Route to confirm user email
router.post('/confirm', confirmUser); // Call the function directly 
router.post('/login', loginUser)
module.exports = router;
