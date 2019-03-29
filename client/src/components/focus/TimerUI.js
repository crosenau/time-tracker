import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { startTimer, stopTimer } from '../../actions/timerActions';

import ProgressRing from './ProgressRing';
import TimerSettings from './TimerSettings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TimerUI.css'

const session = 'session';
const shortBreak = 'Break';
const longBreak = 'Long Break';

function leadingZero(num) {
  if (String(num).length < 2) {
    return '0' + String(num);
  }

  return String(num);
}

class TimerUI extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.timer.currentTimer !== this.props.timer.currentTimer) {
      this.playAlarm();
    }
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
  { startTimer, stopTimer }
)(TimerUI);