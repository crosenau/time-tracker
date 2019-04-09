'use strict';

const router = require('express').Router();
const passport = require('passport');

const Session = require('../../models/Session');

router.post('/save', passport.authenticate('jwt', { session: false }), async (req, res) => {
  req.body.map(doc => {
    doc.userId = req.user._id
  });

  try {
    const saveResult = await Session.create(req.body);

    // Remove userId from docs before sending response
    const savedSessions = saveResult.map(doc => ({
      task: doc.task,
      sessionLength: doc.sessionLength,
      completionDate: doc.completionDate
    }));

    return res.json(savedSessions);
  } catch(err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;