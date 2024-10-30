const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT'); // Import the middleware

router.get('/protected-route', authenticateJWT, (req, res) => {
    // Handle protected route
    res.status(200).json({ msg: 'Access granted', user: req.user }); // Use req.user to access user data
});

module.exports = router; // Correctly export the router
