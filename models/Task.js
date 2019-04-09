'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  taskName: {
    type: String,
    required: true
  },
  taskLength: {
    type: Number,
    min: [1, 'taskLength must be at least 1'],
    required: true
  },
  completedAt: {
    type: Date,
    required: true
  }
});

const Task = mongoose.model('tasks', TaskSchema);

module.exports = Task;