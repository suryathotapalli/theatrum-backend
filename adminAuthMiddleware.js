const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model

const adminAuthMiddleware = async (req, res, next) => {
    try {
        // Ensure Authorization header exists
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication failed. No token provided.' });
        }

        // Extract token from Authorization header
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed. Invalid token format.' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify the role of the user
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // Attach the decoded token payload to the request
        req.admin = decoded;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Admin authentication error:', error.message);
        res.status(401).json({ message: 'Invalid token or authentication failed.', error: error.message });
    }
};

module.exports = adminAuthMiddleware;
