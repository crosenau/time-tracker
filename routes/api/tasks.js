'use strict';

const router = require('express').Router();
const passport = require('passport');

const Task = require('../../models/Task');

router.post('/save', passport.authenticate('jwt', { session: false }), async (req, res) => {
  req.body.map(doc => {
    doc.userId = req.user._id
  });

  try {
    const saveResult = await Task.create(req.body);

    // Remove userId from docs before sending response
    const savedTasks = saveResult.map(doc => ({
      taskName: doc.taskName,
      taskLength: doc.taskLength,
      completedAt: doc.completedAt
    }));

    return res.json(savedTasks);
  } catch(err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;