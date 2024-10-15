// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken'); // Import JWT

// Secret key for JWT (make sure this is the same key used in login token generation)
const JWT_SECRET = process.env.JWT_SECRET || 'SHEE_BEAUTTTE';

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']; // Get token from request headers

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET); // Verify the token and get the payload
        req.user = decoded; // Store the decoded user info in the request
        next(); // Proceed to the next middleware
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Export the middleware
module.exports = verifyToken;
