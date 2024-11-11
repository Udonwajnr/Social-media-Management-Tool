const express = require('express');
const dotenv = require("dotenv").config();
const connectDB = require('./config/db')
const color = require("colors")
const session = require('express-session'); // Import express-session
const axios = require("axios")
let cors = require("cors");
let cookieParser = require("cookie-parser");
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

// Redirect to Facebook OAuth for business page management

app.use('/', require("./route/facebookRoute"));
app.use('/', require("./route/instagramRoute"));
app.use('/', require("./route/linkedinRoute"));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB()