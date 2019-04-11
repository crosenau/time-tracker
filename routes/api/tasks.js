'use strict';

const router = require('express').Router();
const passport = require('passport');
const isEmpty = require('is-empty');

const Task = require('../../models/Task');

router.post('/save', passport.authenticate('jwt', { session: false }), async (req, res) => {
  req.body.map(doc => {
    doc.userId = req.user[0]._id
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
    const response = err.message ? { message: err.message } : { message: err }
    res.status(400).json(response);
  }
});

router.get('/load', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let { start, end } = req.query;

  start = !isEmpty(start) ? new Date(start) : new Date(0);
  end = !isEmpty(end) ? new Date(end) : new Date();

  try {
    const tasks = await Task.find({
      userId: req.user[0]._id,
      completedAt: {
        $gte: start,
        $lte: end
      }
    });

    return res.json(tasks);
  } catch(err) {
    const response = err.message ? { message: err.message } : { message: err }
    res.status(400).json(response);
  }
});

module.exports = router;