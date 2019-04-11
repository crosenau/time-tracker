import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  startTimer,
  stopTimer,
  nextTimer,
  resetCurrentTimer,
  toggleTimerSettings
} from '../../actions/timerActions';

import ProgressRing from './ProgressRing';
import TimerSettings from './TimerSettings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TimerUI.css'


function leadingZero(num) {
  if (String(num).length < 2) {
    return '0' + String(num);
  }

  return String(num);
}

function getTotalTime(tasks) {
  if (tasks.length === 0) {
    return '00:00:00';
  }

  const totalSeconds = (tasks
    .reduce((acc, cur) => ({taskLength: acc.taskLength + cur.taskLength})))
    .taskLength;

  const hours = Math.floor(totalSeconds / 60 / 60);
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;
  
  return `${leadingZero(hours)}:${leadingZero(minutes)}:${leadingZero(seconds)}`;
}

const TimerUI = props => {
  const playButton = 
    <button
      className='icon-btn'
      onClick={props.startTimer}
    >
      <FontAwesomeIcon icon='play' />
    </button>;
  const pauseButton =
    <button
      className='icon-btn'
      onClick={props.stopTimer}
    >
      <FontAwesomeIcon icon='pause' />
    </button>;

  return (
    <div id='timer-ui'>
      {props.timer.displaySettings ? <TimerSettings /> : null}
      <button className='icon-btn' id='settings-btn' onClick={props.toggleTimerSettings}>
        <FontAwesomeIcon icon='ellipsis-v' />
      </button>
      <div id='timer'>
        <ProgressRing />
        <div id='task-label'>{props.timer.currentTimer === 'task' ? props.timer.taskName : props.timer.currentTimer}
        </div>
        <div id='controls'>
          <button
            className='icon-btn'
            onClick={() => {
              props.stopTimer();
              props.resetCurrentTimer()
            }}
          >
            <FontAwesomeIcon icon='undo-alt' />
          </button>
          {props.timer.active ? pauseButton : playButton}
          <button
            className='icon-btn'
            onClick={() => {
              props.stopTimer();
              props.nextTimer();
            }}
          >
            <FontAwesomeIcon icon='forward' />
          </button>
        </div>
      </div>
      <div id='footer'>
          <span>Goal: {props.timer.completedTasks.length}/{props.timer.goal}</span>
          <span>{getTotalTime(props.timer.completedTasks)}</span>
        </div>
    </div>
  );
}

TimerUI.propTypes = {
  auth: PropTypes.object.isRequired,
  timer: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  timer: state.timer
});

export default connect(
  mapStateToProps,
  { startTimer,
    stopTimer,
    resetCurrentTimer,
    nextTimer,
    toggleTimerSettings }
)(TimerUI);