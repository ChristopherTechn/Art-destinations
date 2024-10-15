const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel'); // Adjust based on your project structure

// Login Controller
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate user credentials
        const user = await userModel.validateUser(username, password);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if the user's email is confirmed by checking the 'status' column
        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Please confirm your email first before logging in' });
        }

        // Generate JWT token since the user is active
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expiration time
        });

        // Return success message along with the token
        res.status(200).json({
            message: 'Successfully logged in',
            token: token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
