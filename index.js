// index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const connectDB = require('./config/db')
const color = require("colors")
// require('./config/passport'); // Passport config for Google OAuth

dotenv.config();

const app = express();

// Middleware
app.use(express.json());


// Routes
// app.use('/api/auth', require('./routes/auth'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB()