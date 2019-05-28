import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  startTimer,
  stopTimer,
  updateTimeLeft,
  nextTimer,
  resetCurrentTimer,
  addCompletedTask,
  clearCompletedTasks,
  saveCompletedTasks,
  toggleTimerSettings,
  getTasks,
  getTimer,
} from '../../actions/timerActions';

import { toSeconds } from '../../utils/formatMilliseconds';

class Timer extends Component {
  constructor(props) {
    super(props);

    this.delay = 1000;
    this.count = 0;
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.getTimer();
      this.props.getTasks();
    }
  }

  componentDidUpdate(prevProps) {
    const { auth, timer } = this.props;
    const prevAuth = prevProps.auth;
    const prevTimer = prevProps.timer;

    if (auth.isAuthenticated) {
      if (!prevAuth.isAuthenticated) {
        this.props.getTimer();
        this.props.getTasks();
      }

      if (!prevTimer.active && timer.active) {
        setTimeout(() => this.tick(), this.delay);
      }

    } else if (!auth.isAuthenticated && prevAuth.isAuthenticated) {
      this.props.stopTimer();
    }

    // Reset count if currentTimer switched or currentTimer was reset

    if (
      prevTimer.currentTimer !== timer.currentTimer 
      || timer.timeLeft > prevTimer.timeLeft
    ) {
      this.count = 0;
    }

    // save any unsaved completed tasks to database

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
      timer.currentTimer === 'Break'
      && timer.shortBreakLength !== prevTimer.shortBreakLength
    ) {
      timerChanged = true;
    } else if (
      timer.currentTimer === 'Long Break' 
      && timer.longBreakLength !== prevTimer.longBreakLength
    ) {
      timerChanged = true;
    }

    if (timerChanged && timer.active) {
      this.props.stopTimer();
    }

    timerChanged && this.props.resetCurrentTimer();
  }

  componentWillUnmount() {
    this.props.stopTimer();
  }

  tick() {
    const { timer } = this.props;
    
    if (!timer.active) {
      return;
    }
    
    if (timer.timeLeft < 1000) {
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

      // Add completed task to store
      if (timer.currentTimer === 'Task') {
        this.props.addCompletedTask({
          taskName: timer.taskName,
          taskLength: timer.taskLength,
          completedAt: new Date(),
          saved: false
        });
      }

      setTimeout(() => {
        this.props.nextTimer();
        setTimeout(() => this.props.startTimer(), this.delay);
      }, this.delay);

      return;
    }

    this.count += 1;

    const timerLengths = {
      'Task': timer.taskLength,
      'Break': timer.shortBreakLength,
      'Long Break': timer.longBreakLength
    }

    const timerLength = timerLengths[timer.currentTimer];
    
    /*
    * offset used to pad startTime and expectedTimeLeft to keep it slightly above the 
    * nearest second and prevent ProgressRing from decrementing more than one second per tick
    */ 
    const offset = this.delay * 0.1;

    const startTime = timer.startTime + offset;
    const elapsed = Date.now() - startTime;
    const timeLeft = timer.timeLeftAtStart - elapsed;
    const expectedTimeLeft = (timerLength + offset) - this.count * 1000;
    const difference = expectedTimeLeft - timeLeft;

    let nextdelay = this.delay - difference;
    
    if (nextdelay > 1000)  {
      nextdelay = 1000;
    } else if (nextdelay < 0) {
      nextdelay = 0;
    }

    if (toSeconds(timeLeft) !== toSeconds(timer.timeLeft)) {
      this.props.updateTimeLeft(timeLeft);
    }

    if (timer.active) {
      setTimeout(() => this.tick(), nextdelay);
    }
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
    updateTimeLeft,
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