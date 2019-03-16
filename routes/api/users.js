'use strict';

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const user = require('../../models/user');

router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const foundUser = await user.find({ email: req.body.email });

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

    const newUser = {
      email: req.body.email,
      password: hashedPassword
    };

    const saveResult = await user.save(newUser);

    console.log(saveResult);

  } catch(err) {
    console.log(err);
  }

});