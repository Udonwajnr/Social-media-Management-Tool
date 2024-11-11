const express = require("express")
const dotenv = require("dotenv").config();
const axios = require("axios")
const router = express.Router();


const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI; // Update if using production

router.get('/auth/linkedin', (req, res) => {
    const redirectUri = encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI); // Update with your redirect URI
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const scope = encodeURIComponent('openid profile w_member_social email'); // Updated scopes

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    res.redirect(authUrl);
});

// Step 2: Handle Callback and Exchange Code for Access Token
router.get('/auth/linkedin/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // Exchange the code for an access token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: LINKEDIN_REDIRECT_URI,
                client_id: LINKEDIN_CLIENT_ID,
                client_secret: LINKEDIN_CLIENT_SECRET,
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // Step 3: Use the access token to fetch user's profile data
        const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const profileData = profileResponse.data;
        const emailData = emailResponse.data.elements[0]['handle~'].emailAddress;

        res.json({
            message: 'LinkedIn Authentication Successful',
            profileData,
            email: emailData,
        });

    } catch (error) {
        console.error('Error during LinkedIn authentication:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'LinkedIn authentication failed' });
    }
});


module.exports = router; // Correctly export the router