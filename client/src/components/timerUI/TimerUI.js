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

function getTotalTime(tasks) {
  if (tasks.length === 0) {
    return '0 hours 0 minutes';
  }

  const totalSeconds = (tasks
    .reduce((acc, cur) => ({taskLength: acc.taskLength + cur.taskLength})))
    .taskLength;

  const hours = Math.floor(totalSeconds / 60 / 60);
  const minutes = Math.floor(totalSeconds / 60) % 60;
  
  return `${hours} hours ${minutes} minutes`;
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
        <ProgressRing id={styles.progressRing} />
        <div id={styles.taskLabel}>
          {props.timer.currentTimer === 'Task' ? props.timer.taskName : props.timer.currentTimer}
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
  timer: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
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