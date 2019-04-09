'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  task: {
    type: String,
    required: true
  },
  sessionLength: {
    type: Number,
    min: [1, 'sessionLength must be at least 1'],
    required: true
  },
  completionDate: {
    type: Date,
    required: true
  }
});

const Session = mongoose.model('sessions', SessionSchema);

module.exports = Session;