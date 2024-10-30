const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

const register = async(req,res)=>{
    const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    const payload = { userId: user.id };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }

}

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Create payload with user ID
    const payload = { userId: user.id };

    // Sign and return JWT
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token }); // Send token to the client
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};


const socialAccounts=async(req,res)=>{
    try {
        const user = await User.findById(req.user.id);
    
        res.json({
          facebookAccounts: user.facebookAccounts,
          instagramAccounts: user.instagramAccounts,
          twitterAccounts: user.twitterAccounts,
          linkedinAccounts: user.linkedinAccounts,
        });
      } catch (error) {
        res.status(500).json({ error: 'Error fetching connected accounts' });
      }
}

// making the full authentication
// aand making sure fields are the required field required 
module.exports={register,login,socialAccounts}