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

class Timer extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      console.log('setting interval');
      this.intervalId = setInterval(() => this.tick(), 1000);
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.auth.isAuthenticated && this.props.auth.isAuthenticated) {
      console.log('setting interval');
      this.intervalId = setInterval(() => this.tick(), 1000);
    } else if (!this.props.auth.isAuthenticated && prevProps.auth.isAuthenticated) {
      console.log('clearing interval');
      this.props.stopTimer();
      clearInterval(this.intervalId);
    }
  }

  componentWillUnmount() {
    console.log('clearing interval');
    this.props.stopTimer();
    clearInterval(this.intervalId);
  }

  tick() {
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

  render() {
    const alarm = this.props.timer.alarmSound ? <audio id='beep' src={this.props.timer.alarmSound} /> : null;

    return (
        alarm
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