'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimerSchema = new Schema({
  taskName: {
    type: String,
    required: true
  },
  taskLength: {
    type: Number,
    required: true
  },
  shortBreakLength: {
    type: Number,
    required: true
  },
  longBreakLength: {
    type: Number,
    required: true
  },
  setLength: {
    type: Number,
    required: true
  },
  goal: {
    type: Number,
    required: true
  },
  alarmSound: {
    type: String,
    required: true
  },
  tickSound: {
    type: String,
    required: true
  },
});

const Timer = mongoose.model('Timers', TimerSchema);

module.exports = Timer;