'use strict';

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const User = require('../../models/User');

router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  
  if (!isValid) return res.status(400).json(errors);

  try {
    const foundUser = await User.findOne({ email: req.body.email });

    if (foundUser) {
      return res.status(400).json({ email: 'Email already exists' });
    }

    const password = req.body.password;
    const saltRounds = 10;

    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    const saveResult = await newUser.save();

    console.log('saveResult: ', saveResult);

    res.json({
      name: saveResult.name,
      email: saveResult.email
    });

  } catch(err) {
    console.log(err);
  }
});

router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) return res.status(400).json(errors);

  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(404).json({ email: 'Email not found' });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      const payload = {
        _id: foundUser._id,
        name: foundUser.name
      };

      const newToken = await new Promise((resolve, reject) => { 
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 31556926 },
          (err, token) => {
            if (err) reject(err);
            
            resolve(token);
          }
        );
      });

      return res.json({
        success: true,
        token: 'Bearer ' + newToken
      });
    } else {
      return res
        .status(400)
        .json({ password: 'Password is incorrect' });
    }
  } catch(err) {
    console.log(err);
  }
});

module.exports = router;