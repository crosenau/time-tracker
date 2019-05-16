'use strict';

const router = require('express').Router();
const passport = require('passport');
const isEmpty = require('is-empty');

const Timer = require('../../models/Timer');

router.post('save', passport.authenticate('jwt', { session: false }), async (req, res) => {

  
});