'use strict';

const router = require('express').Router();
const passport = require('passport');

const Timer = require('../../models/Timer');

function filterDoc(doc) {
  if (!doc) {
    return null;
  }

  const validKeys = [
    'taskName',
    'taskLength',
    'shortBreakLength',
    'longBreakLength',
    'setLength',
    'goal',
    'alarmSound',
    'tickSound'
  ];

  const data = doc.toObject ? doc.toObject() : doc
  const filtered = {}
  
  for (let pair of Object.entries(data)) {
    if (validKeys.includes(pair[0])) {
      filtered[pair[0]] = pair[1];
    }
  }
  
  return filtered;
}

router.post('/save', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const query = { userId: req.user[0]._id };
    const newTimer = {
      userId: req.user[0]._id,
      ...req.body
    };
    const opts = {
      new: true,
      upsert: true
    };

    const saveResult = await Timer.findOneAndUpdate(
      query,
      newTimer,
      opts
    ); 
    const savedTimer = filterDoc(saveResult);

    return res.status(200).json(savedTimer);
  } catch(err) {
    console.log(err);
    const response = err.message ? { message: err.message } : { message: err};
    res.status(400).json(response);
  }
});

router.get('/load', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const timer = await Timer.findOne({ userId: req.user[0]._id });
    const response = filterDoc(timer);

    if (!response) {
      return res.status(404).send('No timer settings found for this user');
    }

    return res.status(200).json(response);
  } catch(err) {
    console.log(err);
    const response = err.message ? { message: err.message } : { message: err};
    res.status(400).json(response);
  }
});

module.exports = router;