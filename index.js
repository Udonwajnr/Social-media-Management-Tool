const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const passport = require('passport');
const color = require("colors")
const session = require('express-session'); // Import express-session
require('./config/passport'); // Passport config for Google OAuth
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Add session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey', // Use a secret key
    resave: false,  // Avoid resaving session if nothing has changed
    saveUninitialized: false,  // Avoid creating a session for non-authenticated requests
  }));
// Initialize Passport and restore authentication state
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use('/api/auth', require('./route/authRoute'));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB()