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

    if (auth.isAuthenticated && !prevAuth.isAuthenticated) {
      this.props.getTimer();
      this.props.getTasks();
    } else if (!auth.isAuthenticated && prevAuth.isAuthenticated) {
      this.props.stopTimer();
    }

    if (!prevTimer.active && timer.active) {
      setTimeout(() => this.tick(), this.delay);
    }

    // Reset count if currentTimer switched or currentTimer was reset
    if (
      prevTimer.currentTimer !== timer.currentTimer 
      || timer.timeLeft > prevTimer.timeLeft
    ) {
      this.count = 0;
    }

    if (prevTimer.completedTasks !== timer.completedTasks) {
      this.saveTasks();
    }

    this.resetTimerOnChange(prevProps);
  }

  componentWillUnmount() {
    this.props.stopTimer();
  }

  saveTasks() {
    const unsavedTasks = this.props.timer.completedTasks
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

  resetTimerOnChange(prevProps) {
    // Check if current timer has changed settings and reset it

    const { timer } = this.props;
    const prevTimer = prevProps.timer;

    const changedTimers = [
      timer.taskLength !== prevTimer.taskLength && 'Task',
      timer.shortBreakLength !== prevTimer.shortBreakLength && 'Break',
      timer.longBreakLength !== prevTimer.longBreakLength && 'Long Break'
    ];

    const timerChanged = changedTimers.includes(timer.currentTimer);

    if (timerChanged && timer.active) {
      this.props.stopTimer();
    }

    timerChanged && this.props.resetCurrentTimer();
  }

  tick() {
    const { timer } = this.props;

    if (!timer.active) {
      return;
    }
    
    if (timer.timeLeft < 1000) {
      this.props.stopTimer();

      this.clearTasksOnNewDay()

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

    this.decrementTimeLeft();
  }

  clearTasksOnNewDay() {
    // if new day, clear completedTasks

    const { timer } = this.props;
    const today = new Date().getDay();
    const lastRecord = timer.completedTasks[timer.completedTasks.length-1]

    if (lastRecord && lastRecord.completedAt.getDay() !== today) {
      this.props.clearCompletedTasks();
    }
  }

  decrementTimeLeft() {
    this.count += 1;

    const { timer } = this.props;
    const timerLengths = {
      'Task': timer.taskLength,
      'Break': timer.shortBreakLength,
      'Long Break': timer.longBreakLength
    }
    const timerLength = timerLengths[timer.currentTimer];
    
    // offset used to pad startTime and expectedTimeLeft to keep timer slightly above the 
    // nearest second and prevent ProgressRing from decrementing more than one second per tick
    const offset = this.delay * 0.1;

    const elapsed = Date.now() - (timer.startTime + offset);
    const timeLeft = timer.timeLeftAtStart - elapsed;
    const expectedTimeLeft = (timerLength + offset) - this.count * 1000;
    const difference = expectedTimeLeft - timeLeft;

    let nextDelay = this.delay - difference;
    
    if (nextDelay > 1000)  {
      nextDelay = 1000;
    } else if (nextDelay < 0) {
      nextDelay = 0;
    }

    if (toSeconds(timeLeft) !== toSeconds(timer.timeLeft)) {
      this.props.updateTimeLeft(timeLeft);
    }

    if (timer.active) {
      setTimeout(() => this.tick(), nextDelay);
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