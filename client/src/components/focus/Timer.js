import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  startTimer,
  stopTimer,
  updateTimeRemaining,
  nextTimer,
  resetCurrentTimer,
  updateSettings,
  toggleSettingsDisplay
} from '../../actions/timerActions';

import ProgressRing from './ProgressRing';
import TimerSettings from './TimerSettings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Timer.css'


const session = 'session';
const shortBreak = 'Break';
const longBreak = 'Long Break';


function leadingZero(num) {
  if (String(num).length < 2) {
    return '0' + String(num);
  }

  return String(num);
}

class Timer extends Component {

  componentDidMount() {
    this.intervalId = setInterval(() => this.timerTick(), 1000);
  }

  componentWillUnmount() {
    console.log('unmounting')
    this.props.stopTimer();
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  timerTick() {
    if (!this.props.timer.active) {
      return;
    }

    if (this.props.timer.timeRemaining <= 0) {
      this.props.stopTimer();
      this.playAlarm();
      this.props.nextTimer();
      this.props.startTimer();
      return;
    }

    this.props.updateTimeRemaining();
  }

  playAlarm() {
    const alarm = document.querySelector('#beep');

    if (alarm) {
      alarm.currentTime = 0;
     alarm.play();
    }
  }

  percentRemaining() {
   switch (this.props.timer.currentTimer) {
    case session:
      return (this.props.timer.timeRemaining / this.props.timer.sessionLength) * 100;
    case shortBreak:
      return (this.props.timer.timeRemaining / this.props.timer.shortBreakLength) * 100;
    case longBreak:
      return (this.props.timer.timeRemaining / this.props.timer.longBreakLength) * 100;
   }
  }

  render() {
    const minutesLeft = Math.floor(this.props.timer.timeRemaining / 60);
    const secondsLeft = this.props.timer.timeRemaining % 60;
    const timeLeft = `${leadingZero(minutesLeft)}:${leadingZero(secondsLeft)}`;
    const playButton = 
      <button
        className='icon-btn'
        onClick={this.props.startTimer}
      >
        <FontAwesomeIcon icon='play' />
      </button>;
    const pauseButton =
      <button
        className='icon-btn'
        onClick={this.props.stopTimer}
      >
        <FontAwesomeIcon icon='pause' />
      </button>;

    return (
      <div id='timer'>
        {this.props.timer.displaySettings ? <TimerSettings /> : null}
        <ProgressRing percent={this.percentRemaining()} />
        <div id='timer-elements'>
          <div id='timer-label'>{this.props.timer.currentTimer === session ? this.props.timer.task : this.props.timer.currentTimer}</div>
          <div id='time-left'>{timeLeft}</div>
          {this.props.timer.active ? pauseButton : playButton}
          {this.props.timer.alarm ? <audio id='beep' src={this.props.timer.alarm} /> : null}
          <audio id='beep' src={this.props.timer.alarmSound} />

        </div>
      </div>
    );
  }
}

Timer.propTypes = {
  auth: PropTypes.object.isRequired,
  timer: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  timer: state.timer
});

export default connect(
  mapStateToProps,
  { 
    startTimer,
    stopTimer,
    updateTimeRemaining,
    nextTimer,
    resetCurrentTimer,
    updateSettings,
    toggleSettingsDisplay
  }
)(Timer);