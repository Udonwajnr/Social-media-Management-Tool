const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;
      try {
        // Check if a user with the same email already exists
        let user = await User.findOne({ email: emails[0].value });

        if (user) {
          // If user exists and has a password (meaning they signed up via email/password)
          if (user.password) {
            console.log("Email already exists")
            return done(null, false, { message: 'Email already exists and has a password.' });
          }

          // If user exists but doesn't have a password, log them in via Google
          return done(null, user);
        } else {
          // If user doesn't exist, create a new one
          user = new User({
            googleId: id,
            name: displayName,
            email: emails[0].value,
          });

          await user.save();
          done(null, user);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Session setup: serialize user to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Session setup: deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);  // No callbacks, just use async/await
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});