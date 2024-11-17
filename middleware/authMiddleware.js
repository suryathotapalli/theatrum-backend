const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];

  // Check if the token exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debug log to check the decoded token
    console.log('Decoded token:', decoded);

    // Attach the decoded user info to the request object
    req.user = decoded;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    // Handle invalid or expired tokens
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
