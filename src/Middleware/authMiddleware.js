const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'SHEE_BEAUTTTE';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No valid token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded.user_id) {
            return res.status(401).json({ error: 'Invalid token: user ID missing' });
        }

        req.user = decoded; // Attach user data to request
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please log in again.' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token. Please log in again.' });
        }
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = verifyToken;
