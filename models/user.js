const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // For login and sign up
  name: { 
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,  // No duplicate emails across users
    sparse: true   // Allow null or undefined in the case of social logins without email
  },
  password: { 
    type: String
  },
  googleId: {
    type: String
  }, // For Google OAuth

  facebookId:{
    type:String
  },

  // for oauth Social media accounts
  facebookAccounts: [
    {
      accessToken: String,
      pageId: String,
      pageName: String,
      email: String,  // Facebook email (if provided)
      phoneNumber: String,  // Facebook phone number (fallback if no email)
      connectedAt: { type: Date, default: Date.now },
    }
  ],

  // come back and do this
  instagramAccounts: [
    {
      accessToken: String,
      profileId: String,
      profileName: String,
      connectedAt: { type: Date, default: Date.now },
    }
  ],
  twitterAccounts: [
    {
      accessToken: String,
      accessTokenSecret: String,
      profileId: String,
      profileName: String,
      connectedAt: { type: Date, default: Date.now },
    }
  ],
  linkedinAccounts: [
    {
      accessToken: String,
      profileId: String,
      profileName: String,
      connectedAt: { type: Date, default: Date.now },
    }
  ],
  createdAt: { 
    type: Date,
    default: Date.now
  }
});

// Hash password before saving user if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});

module.exports = mongoose.model('User', UserSchema);
