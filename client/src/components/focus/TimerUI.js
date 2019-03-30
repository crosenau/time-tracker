import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { startTimer, stopTimer, toggleSettingsDisplay } from '../../actions/timerActions';

import ProgressRing from './ProgressRing';
import TimerSettings from './TimerSettings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TimerUI.css'

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
    <div id='container'>
      {props.timer.displaySettings ? <TimerSettings /> : null}
      <button className='icon-btn' id='settings-btn' onClick={props.toggleSettingsDisplay}>
        <FontAwesomeIcon icon='cog' />    
      </button>
      <div id='display'>
        <ProgressRing />
        <div id='timer-label'>{props.timer.currentTimer === 'session' ? props.timer.task : props.timer.currentTimer}
        </div>
        {props.timer.active ? pauseButton : playButton}
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
  { startTimer, stopTimer, toggleSettingsDisplay }
)(TimerUI);