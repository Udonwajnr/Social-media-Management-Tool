const express = require("express")
const dotenv = require("dotenv").config();
const axios = require("axios")
const router = express.Router();

// ========Instagram auth========
const INSTAGRAM_APP_ID=process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET=process.env.INSTAGRAM_APP_SECRET;
const REDIRECT_URI ="https://social-media-mamangement-6nze.vercel.app/auth/instagram/callback"

router.get('/auth/instagram', (req, res) => {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    res.redirect(authUrl);
  });
  
  // Step 2: Handle Callback and Exchange Code for Access Token
router.get('/auth/instagram/callback', async (req, res) => {
    const { code } = req.query; // Get authorization code from query
  
    try {
        // Exchange the code for an access token
        const response = await axios.post('https://api.instagram.com/oauth/access_token', qs.stringify({
            client_id: INSTAGRAM_APP_ID,
            client_secret: INSTAGRAM_APP_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            code, // Authorization code
        }));
  
        // Extract access token and user ID
        const accessToken = response.data.access_token;
        const userId = response.data.user_id;
  
        // Step 3: Use the access token to fetch user's profile data
        const profileResponse = await axios.get(`https://graph.instagram.com/${userId}`, {
            params: {
                fields: 'id,username,account_type', // Request specific fields
                access_token: accessToken,
            },
        });
  
        // Profile data contains user info
        const profileData = profileResponse.data;
        
        // Send response with profile data
        res.json({
            message: 'Instagram Authentication Successful',
            profileData,
        });
  
    } catch (error) {
        // Handle errors (e.g., invalid code, network issues)
        console.error('Error during Instagram authentication:', error.response.data);
        res.status(500).json({ error: 'Instagram authentication failed' });
    }
  });
  

module.exports = router; // Correctly export the router