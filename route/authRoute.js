const express = require('express');
const router = express.Router();
const { register, login, socialAccounts } = require('../controller/authController');
const passport = require('passport');
const axios = require('axios');
const querystring = require('querystring');
const User = require('../models/user'); // Assuming you have a User model
// const authenticateJWT = require('.'); // Import the middleware

const clientID = process.env.FACEBOOK_APP_ID;
const clientSecret = process.env.FACEBOOK_APP_SECRET;
const redirectUri = 'http://localhost:8000/api/auth/facebook/callback';

// User registration and login
// router.post('/register', register);
// router.post('/login', login);

// // Google OAuth route
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // Google OAuth callback
// router.get('/google/callback', passport.authenticate('google', {
//   failureRedirect: '/login',
// }), (req, res) => {
//   res.redirect('/dashboard'); // On successful login, redirect to dashboard
// });

// Facebook OAuth route

// Redirect user to Facebook's authorization page


router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook callback URL
router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard'); // Redirect after successful login
  }
);

module.exports = router;


// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   async (req, res) => {
//     try {
//       const userId = req.user.id; // Access the authenticated user's ID
//       const accessToken = req.user.accessToken; // Get the access token directly from req.user, set in the Passport strategy

//       if (!accessToken) {
//         return res.status(401).json({ error: 'Access token not provided.' });
//       }

//       // Retrieve connected Facebook Pages
//       const pageResponse = await axios.get(`https://graph.facebook.com/v17.0/me/accounts?access_token=${accessToken}`);

//       const pages = pageResponse.data?.data || []; // Pages the user manages

//       // Check if the user already exists in your database
//       let user = await User.findById(userId);

//       if (!user) {
//         // User does not exist, handle this case
//         return res.status(404).json({ error: 'User not found in the database.' });
//       }

//       // If user exists, check if the Facebook account is already connected
//       pages.forEach((page) => {
//         const existingAccount = user.facebookAccounts.find((account) => account.pageId === page.id);

//         if (!existingAccount) {
//           // Add the new page/account connection
//           user.facebookAccounts.push({
//             accessToken: page.access_token,
//             pageId: page.id,
//             pageName: page.name,
//             connectedAt: new Date(),
//           });
//         }
//       });

//       await user.save(); // Save the user with updated Facebook account info
//       res.redirect('/dashboard'); // Redirect to dashboard after successful connection
//     } catch (error) {
//       console.error('Error retrieving pages:', error.message);
//       res.status(500).json({ error: 'Failed to connect Facebook account' });
//     }
//   }
// );

  
// Instagram auth - Placeholder
// LinkedIn auth - Placeholder

// Route to view connected social accounts
router.get('/social-accounts', socialAccounts);

module.exports = router;
