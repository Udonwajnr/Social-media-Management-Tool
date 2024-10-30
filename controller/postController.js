const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

const postScheduling =async(req,res)=>{
    const { platform, accountId, content, scheduledTime } = req.body;

    try {
      const user = await User.findById(req.user.id);
  
      let accessToken;
  
      if (platform === 'facebook') {
        const account = user.facebookAccounts.find(account => account.pageId === accountId);
        if (account) accessToken = account.accessToken;
      }
  
      // Similar logic for Instagram, Twitter, LinkedIn
  
      if (!accessToken) {
        return res.status(400).json({ error: 'Invalid account selected' });
      }
  
      // Use the accessToken to schedule the post via the appropriate API
      // Example for Facebook:
      await axios({
        method: 'post',
        url: `https://graph.facebook.com/v12.0/${accountId}/feed`,
        params: {
          message: content,
          access_token: accessToken,
          published: false, // If scheduling a post
          scheduled_publish_time: new Date(scheduledTime).getTime() / 1000, // Unix timestamp for scheduling
        },
      });
  
      res.status(200).json({ message: 'Post scheduled successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to schedule post' });
    }
  }


module.exports={postScheduling}