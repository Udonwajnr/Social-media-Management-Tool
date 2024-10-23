const express = require('express');
const router = express.Router();
const {register,login} = require('../controller/authController')
const passport = require('passport');

router.post('/register',register)
router.post('/login',login)

// routes/auth.js (Google OAuth routes)
// Google OAuth route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
}), (req, res) => {
  res.redirect('/'); // On successful login, redirect to dashboard
});

module.exports = router;