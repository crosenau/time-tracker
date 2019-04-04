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
  clearCompletedSessions,
  saveCompletedSessions,
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

    // save any unsaved completed sessions to db
    const timer = this.props.timer;

    if (prevProps.timer.completedSessions !== timer.completedSessions) {
      const unsavedSessions = timer.completedSessions
        .filter(session => !session.saved)
        .map(session => ({
            task: session.task,
            sessionLength: session.sessionLength,
            completionDate: session.completionDate
        }));
      
      if (unsavedSessions.length > 0) {
        console.log('unsavedSessions found');
        this.props.saveCompletedSessions(unsavedSessions);
      };
    }
  }

  componentWillUnmount() {
    console.log('clearing interval');
    this.props.stopTimer();
    clearInterval(this.intervalId);
  }

  tick() {
    const timer = this.props.timer;

    if (!timer.active) {
      return;
    }

    if (timer.timeRemaining <= 0) {
      this.props.stopTimer();
      this.playAlarm();

      // if new day, reset completedSessions
      const today = new Date().getDay();
      
      let lastRecord;

      if (timer.completedSessions.length > 0) {
        lastRecord = timer.completedSessions[timer.completedSessions.length-1].completionDate.getDay();
      }

      if (lastRecord && lastRecord !== today) {
        this.props.clearCompletedSessions();
      }

      // cache completed session
      if (timer.currentTimer === 'session') {
        const session = {
          task: timer.task,
          sessionLength: timer.sessionLength,
          completionDate: new Date(),
          saved: false
        };

        this.props.addCompletedSession(session)
      }

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
    clearCompletedSessions,
    saveCompletedSessions,
    updateSettings,
    toggleSettingsDisplay
  }
)(Timer);