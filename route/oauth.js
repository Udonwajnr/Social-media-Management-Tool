// Initialize simple-oauth2 client
const { create } = require('simple-oauth2');

const oauth2 = create({
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'https://oauth-provider.com',
    authorizePath: '/authorize',
    tokenPath: '/token',
  },
});

// Route to redirect to the provider’s authorization page
app.get('/auth/login', (req, res) => {
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'https://your-app.com/callback',
    scope: 'profile email',
  });
  res.redirect(authorizationUri);
});

// Callback route to handle the token exchange
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const tokenConfig = {
    code,
    redirect_uri: 'https://your-app.com/callback',
  };

  try {
    const result = await oauth2.authorizationCode.getToken(tokenConfig);
    const accessToken = oauth2.accessToken.create(result);
    res.json({ accessToken });
  } catch (error) {
    console.log('Access Token Error', error.message);
    res.status(500).json('Authentication failed');
  }
});
