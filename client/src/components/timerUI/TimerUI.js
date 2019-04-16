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
import TimerSettings from '../settings/TimerSettings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './TimerUI.module.css'


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
    <div id={styles.container}>
      {props.timer.displaySettings ? <TimerSettings /> : null}
      <div id={styles.header}>
        <button 
          className='icon-btn' 
          id={styles.settingsButton} 
          onClick={props.toggleTimerSettings}
        >
          <FontAwesomeIcon icon='ellipsis-v' />
        </button>
      </div>
      <div id={styles.timer}>
        <ProgressRing />
        <div id={styles.taskLabel}>
          {props.timer.currentTimer === 'task' ? props.timer.taskName : props.timer.currentTimer}
        </div>
        <div id={styles.controls}>
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
      <div id={styles.footer}>
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