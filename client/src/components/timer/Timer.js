import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  startTimer,
  stopTimer,
  updatetimeLeft,
  nextTimer,
  resetCurrentTimer,
  addCompletedTask,
  clearCompletedTasks,
  saveCompletedTasks,
  toggleTimerSettings,
  getTasks,
  getTimer,
} from '../../actions/timerActions';

class Timer extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.intervalId = setInterval(() => this.tick(), 1000);
      this.props.getTimer();
      this.props.getTasks();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.auth.isAuthenticated && this.props.auth.isAuthenticated) {
      this.intervalId = setInterval(() => this.tick(), 1000);
      this.props.getTimer();
      this.props.getTasks();
    } else if (!this.props.auth.isAuthenticated && prevProps.auth.isAuthenticated) {
      this.props.stopTimer();
      clearInterval(this.intervalId);
    }

    // save any unsaved completed tasks to db
    const timer = this.props.timer;
    const prevTimer = prevProps.timer;

    if (prevTimer.completedTasks !== timer.completedTasks) {
      const unsavedTasks = timer.completedTasks
        .filter(task => !task.saved)
        .map(task => ({
            taskName: task.taskName,
            taskLength: task.taskLength,
            completedAt: task.completedAt
        }));
      
      if (unsavedTasks.length > 0) {
        this.props.saveCompletedTasks(unsavedTasks);
      };
    }

    // Check if active timer has changed settings and reset it
    let timerChanged = false; 

    if (timer.currentTimer === 'Task' && timer.taskLength !== prevTimer.taskLength) {
      timerChanged = true;
    } else if (
      timer.currentTimer === 'Break' && timer.shortBreakLength !== prevTimer.shortBreakLength) {
      timerChanged = true;
    } else if (timer.currentTimer === 'Long Break' && timer.longBreakLength !== prevTimer.longBreakLength) {
      timerChanged = true;
    }

    if (timerChanged && timer.active) {
      this.props.stopTimer();
    }

    timerChanged && this.props.resetCurrentTimer();
  }

  componentWillUnmount() {
    this.props.stopTimer();
    clearInterval(this.intervalId);
  }

  tick() {
    const timer = this.props.timer;

    if (!timer.active) {
      return;
    }

    if (timer.timeLeft < 1) {
      this.props.stopTimer();

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
      if (timer.currentTimer === 'Task') {
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

    this.props.updatetimeLeft();
  }

  render() {
    return null;
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
    updatetimeLeft,
    nextTimer,
    resetCurrentTimer,
    addCompletedTask,
    clearCompletedTasks,
    saveCompletedTasks,
    toggleTimerSettings,
    getTasks,
    getTimer
  }
)(Timer);