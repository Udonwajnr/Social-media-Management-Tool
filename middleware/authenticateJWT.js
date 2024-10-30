const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    // Get token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // Assuming 'Bearer token' format

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ msg: 'Token is not valid' });
        }
        req.user = user; // Attach user ID to request
        next(); // Proceed to the next middleware/route handler
    });
};

module.exports = authenticateJWT; // Correctly export the middleware
