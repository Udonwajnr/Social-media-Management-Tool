const express = require('express');
const dotenv = require("dotenv").config();
const connectDB = require('./config/db')
const color = require("colors")
const session = require('express-session'); // Import express-session
const axios = require("axios")
let cors = require("cors");
let cookieParser = require("cookie-parser");
const { AuthorizationCode  } = require('simple-oauth2');
const querystring=require("querystring")

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8000',
      // 'https://medical-inventory-beta.vercel.app'
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the HTTP methods you want to allow
}));
app.use(cookieParser());
app.use(cors(corsOptions));

const BUSINESS_APP_ID = process.env.FACEBOOK_BUSINESS_APP_ID;
const BUSINESS_APP_SECRET = process.env.FACEBOOK_BUSINESS_APP_SECRET;
const BUSINESS_REDIRECT_URI = process.env.FACEBOOK_BUSINESS_REDIRECT_URI;

const PROFILE_APP_ID = process.env.FACEBOOK_PROFILE_APP_ID;
const PROFILE_APP_SECRET = process.env.FACEBOOK_PROFILE_APP_SECRET;
const PROFILE_REDIRECT_URI = process.env.FACEBOOK_PROFILE_REDIRECT_URI;

const INSTAGRAM_APP_ID=process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET=process.env.INSTAGRAM_APP_SECRET;
const REDIRECT_URI ="https://social-media-mamangement-6nze.vercel.app/auth/instagram/callback"


// Redirect to Facebook OAuth for business page management
app.get('/auth/facebook/business', (req, res) => {
  const authUrl = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${BUSINESS_APP_ID}&redirect_uri=${BUSINESS_REDIRECT_URI}&scope=pages_manage_posts,pages_read_engagement`;
  res.redirect(authUrl);
});

// Handle callback for business page management
app.get('/auth/facebook/business/callback', async (req, res) => {
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
app.get('/auth/facebook/profile', (req, res) => {
  const authUrl = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${PROFILE_APP_ID}&redirect_uri=${PROFILE_REDIRECT_URI}&scope=user_posts,user_photos`;
  res.redirect(authUrl);
});

// Handle callback for personal profile management
app.get('/auth/facebook/profile/callback', async (req, res) => {
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

// facebook auth ending

// ========Instagram auth========
app.get('/auth/instagram', (req, res) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
});

// Step 2: Handle Callback and Exchange Code for Access Token
app.get('/auth/instagram/callback', async (req, res) => {
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

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB()