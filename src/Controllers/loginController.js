// src/Controllers/authController.js (or wherever this lives)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Debug log to verify req.body
    console.log('Received request body:', req.body);

    if (!username || !password) {
        console.log('Missing username or password');
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Validate user credentials
        const user = await userModel.validateUser(username, password);

        if (!user || !user.user_id) {
            console.log('Invalid username or password');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if email is confirmed
        if (user.status !== 'active') {
            console.log('User email not confirmed');
            return res.status(403).json({ message: 'Please confirm your email first before logging in' });
        }

        // Generate JWT token with user_id
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key', // Fallback for testing
            { expiresIn: '1h' }
        );

        console.log('User logged in successfully:', { user_id: user.user_id });

        res.status(200).json({
            message: 'Successfully logged in',
            token: token
        });
    } catch (err) {
        console.error('Login error:', err.message || err);
        res.status(500).json({ message: 'Internal server error' });
    }
};