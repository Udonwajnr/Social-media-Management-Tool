const express = require("express")
const dotenv = require("dotenv").config();
const axios = require("axios")
const router = express.Router();

// ========Instagram auth========
const BUSINESS_APP_ID = process.env.FACEBOOK_BUSINESS_APP_ID;
const BUSINESS_APP_SECRET = process.env.FACEBOOK_BUSINESS_APP_SECRET;
const BUSINESS_REDIRECT_URI = process.env.FACEBOOK_BUSINESS_REDIRECT_URI;

const PROFILE_APP_ID = process.env.FACEBOOK_PROFILE_APP_ID;
const PROFILE_APP_SECRET = process.env.FACEBOOK_PROFILE_APP_SECRET;
const PROFILE_REDIRECT_URI = process.env.FACEBOOK_PROFILE_REDIRECT_URI;

router.get('/auth/facebook/business', (req, res) => {
    const authUrl = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${BUSINESS_APP_ID}&redirect_uri=${BUSINESS_REDIRECT_URI}&scope=pages_manage_posts,pages_read_engagement`;
    res.redirect(authUrl);
  });
  
  // Handle callback for business page management
router.get('/auth/facebook/business/callback', async (req, res) => {
    const { code } = req.query;
  
    try {
        // Exchange code for access token
        const tokenResponse = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token`, {
            params: {
                client_id: BUSINESS_APP_ID,
                redirect_uri: BUSINESS_REDIRECT_URI,
                client_secret: BUSINESS_APP_SECRET,
                code,
            },
        });
  
        const accessToken = tokenResponse.data.access_token;
  
        // Retrieve Page access tokens for business management
        const pageDataResponse = await axios.get(`https://graph.facebook.com/v13.0/me/accounts`, {
            params: {
                access_token: accessToken,
            },
        });
  
        const pages = pageDataResponse.data.data;
        res.json({ message: 'Business pages retrieved', pages });
  
    } catch (error) {
        res.status(500).json({ message: 'Error during business page login', error: error.response.data });
    }
  });  

  // Redirect to Facebook OAuth for personal profile management
  router.get('/auth/facebook/profile', (req, res) => {
    const authUrl = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${PROFILE_APP_ID}&redirect_uri=${PROFILE_REDIRECT_URI}&scope=user_posts,user_photos`;
    res.redirect(authUrl);
  });
  
  // Handle callback for personal profile management
  router.get('/auth/facebook/profile/callback', async (req, res) => {
    const { code } = req.query;
  
    try {
        // Exchange code for access token
        const tokenResponse = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token`, {
            params: {
                client_id: PROFILE_APP_ID,
                redirect_uri: PROFILE_REDIRECT_URI,
                client_secret: PROFILE_APP_SECRET,
                code,
            },
        });
  
        const accessToken = tokenResponse.data.access_token;
  
        // Retrieve user profile info or posts as needed
        const userProfileResponse = await axios.get(`https://graph.facebook.com/v13.0/me`, {
            params: {
                access_token: accessToken,
                fields: 'id,name,email', // Add additional fields as required
            },
        });
  
        const profile = userProfileResponse.data;
        res.json({ message: 'Profile data retrieved', profile });
  
    } catch (error) {
        res.status(500).json({ message: 'Error during profile login', error: error.response.data });
    }
  });
  
module.exports = router; // Correctly export the router