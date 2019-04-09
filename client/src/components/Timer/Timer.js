import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  startTimer,
  stopTimer,
  updateTimeRemaining,
  nextTimer,
  resetCurrentTimer,
  addCompletedTask,
  clearCompletedTasks,
  saveCompletedTasks,
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

    // save any unsaved completed tasks to db
    const timer = this.props.timer;

    if (prevProps.timer.completedTasks !== timer.completedTasks) {
      const unsavedTasks = timer.completedTasks
        .filter(task => !task.saved)
        .map(task => ({
            taskName: task.taskName,
            taskLength: task.taskLength,
            completedAt: task.completedAt
        }));
      
      if (unsavedTasks.length > 0) {
        console.log('unsavedTasks found');
        this.props.saveCompletedTasks(unsavedTasks);
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

      // if new day, reset completedTasks
      const today = new Date().getDay();
      
      let lastRecord;

      if (timer.completedTasks.length > 0) {
        lastRecord = timer.completedTasks[timer.completedTasks.length-1].completedAt.getDay();
      }

      if (lastRecord && lastRecord !== today) {
        this.props.clearCompletedTasks();
      }

      // cache completed task
      if (timer.currentTimer === 'task') {
        const task = {
          taskName: timer.taskName,
          taskLength: timer.taskLength,
          completedAt: new Date(),
          saved: false
        };

        this.props.addCompletedTask(task)
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
    addCompletedTask,
    clearCompletedTasks,
    saveCompletedTasks,
    updateSettings,
    toggleSettingsDisplay
  }
)(Timer);