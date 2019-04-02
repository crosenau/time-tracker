import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  startTimer,
  stopTimer,
  updateTimeRemaining,
  nextTimer,
  resetCurrentTimer,
  addCompletedSession,
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

      const { currentTimer, task, sessionLength, completedSessions } = this.props.timer;

      // if new day, reset completedSessions
      const today = new Date().getDay();
      
      let lastRecord;

      if (completedSessions.length > 0) {
        lastRecord = completedSessions[completedSessions.length-1].completionDate.getDay();
      }

      if (lastRecord && lastRecord !== today) {
        this.props.clearCompletedSessions();
      }

      // cache completed session
      if (currentTimer === 'session') {
        const session = {
          task,
          sessionLength,
          completionDate: new Date(),
          userId: this.props.auth.user._id,
          logged: false
        };

        this.props.addCompletedSession(session)
      }

      // save any unsaved completed sessions to db
      //this.props.logCompletedSessions();

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
    addCompletedSession,
    updateSettings,
    toggleSettingsDisplay
  }
)(Timer);