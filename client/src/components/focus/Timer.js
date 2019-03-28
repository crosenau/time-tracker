import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import actions

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import css
import './Timer.css'
import ProgressRing from './ProgressRing';
import TimerSettings from './TimerSettings';

const session = 'session';
const shortBreak = 'Break';
const longBreak = 'Long Break';

class Timer extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      task: 'Work',
      shortBreakLength: 1,
      longBreakLength: 2,
      sessionLength: 3,
      setLength: 4,
      goal: 12,
      alarm: 'https://res.cloudinary.com/carpol/video/upload/v1542177884/Pomodoro%20Clock/78506__joedeshon__desk-bell-one-time-01.mp3',
      tick: null, // url
      completedSessions: 0,
      settings: false,
      currentTimer: session,
      active: false,
      timeRemaining: 3,
      startTime: null,
      timeRemainingAtStart: null,
    };

    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }

  componentDidMount() {
    this.intervalId = setInterval(() => this.timerTick(), 1000);
  }

  startTimer() {
    if (this.state.active) {
      return;
    }

    console.log('startTimer');

    const startTime = Date.now();

    this.setState({
      timeRemainingAtStart: this.state.timeRemaining,
      startTime,
      active: true
    });
  }

  timerTick() {
    if (!this.state.active) {
      return;
    }

    console.log('timerTick');
    const { timeRemainingAtStart, startTime } = this.state;

    const secondsElapsed = Math.round((Date.now() - startTime) / 1000);
    const timeRemaining = timeRemainingAtStart - secondsElapsed;

    if (timeRemaining < 0) {
      this.stopTimer();
      this.playAlarm();
      this.switchTimer();
      return;
    }

    this.setState({
      timeRemaining
    });
  }

  playAlarm() {
    const alarm = document.querySelector('#beep');

    if (alarm) {
      alarm.currentTime = 0;
     alarm.play();
    }
  }

  switchTimer() {
    let { completedSessions, timeRemaining, currentTimer } = this.state;

    if (currentTimer === session) {
      completedSessions++;
      if (completedSessions % this.state.setLength === 0) {
        timeRemaining = this.state.longBreakLength;
        currentTimer = longBreak;
      } else {
        timeRemaining = this.state.shortBreakLength;
        currentTimer = shortBreak;
      }
    } else {
      timeRemaining = this.state.sessionLength;
      currentTimer = session;
    }

    this.setState({
      completedSessions,
      timeRemaining,
      currentTimer
    });
    this.startTimer();
  }

  stopTimer() {
    this.setState({
      active: false
    });
  }

  updateSettings(settings) {
    console.log('passed settings: ', settings);
    this.stopTimer();
    this.setState(settings, () => this.resetCurrentTimer());
  }

  resetCurrentTimer() {
    let timeRemaining;

    switch (this.state.currentTimer) {
      case session:
        timeRemaining = this.state.sessionLength;
        break;
      case shortBreak:
        timeRemaining = this.state.shortBreakLength;
        break;
      case longBreak:
        timeRemaining = this.state.longBreakLength;
        break;
    }

    console.log('resetCurrentTimer() with ', timeRemaining);

    this.setState({
      timeRemaining,
      timeRemainingAtStart: timeRemaining
    });
  }

  resetApp() {
    const alarm = document.querySelector('#beep');
    
    alarm.pause();
    alarm.currentTime = 0;

    this.setState({
    });
  }

  percentRemaining() {
   switch (this.state.currentTimer) {
    case session:
      return (this.state.timeRemaining / this.state.sessionLength) * 100;
    case shortBreak:
      return (this.state.timeRemaining / this.state.shortBreakLength) * 100;
    case longBreak:
      return (this.state.timeRemaining / this.state.longBreakLength) * 100;
   }
  }

  leadingZero(num) {
    if (String(num).length < 2) {
      return '0' + String(num);
    }

    return String(num);
  }

  toggleSettings() {
    this.setState({
      settings: !this.state.settings
    });
  }

  render() {
    const minutesLeft = Math.floor(this.state.timeRemaining / 60);
    const secondsLeft = this.state.timeRemaining % 60;
    const timeLeft = `${this.leadingZero(minutesLeft)}:${this.leadingZero(secondsLeft)}`;
    const playButton = 
      <button
        class='icon-btn'
        onClick={this.startTimer}
      >
        <FontAwesomeIcon icon='play' />
      </button>;
    const pauseButton =
      <button
        class='icon-btn'
        onClick={this.stopTimer}
      >
        <FontAwesomeIcon icon='pause' />
      </button>;
    const settings =         
      <TimerSettings
        task={this.state.task}
        sessionLength={this.state.sessionLength}
        shortBreakLength={this.state.shortBreakLength}
        longBreakLength={this.state.longBreakLength}
        setLength={this.state.setLength}
        goal={this.state.goal}
        alarm={this.state.alarm}
        tick={this.state.tick}
        active={Boolean(this.state.active)}
        toggleSettings={this.toggleSettings}
        updateSettings={this.updateSettings}
      />;

    return (
      <div id='timer'>
        {this.state.settings ? settings : null}
        <ProgressRing percent={this.percentRemaining()} />
        <div id='timer-elements'>
          <div id='timer-label'>{this.state.currentTimer === session ? this.state.task : this.state.currentTimer}</div>
          <div id='time-left'>{timeLeft}</div>
          {this.state.active ? pauseButton : playButton}
          <button class='icon-btn' id='settings-btn' onClick={this.toggleSettings}>
            <FontAwesomeIcon icon='cog' />    
          </button>

          {this.state.alarm ? <audio id='beep' src={this.state.alarm} /> : null}
        </div>
      </div>
    );
  }
}

export default Timer;

/*
Timer.propTypes = {
  auth: PropTypes.object.isRequired,
  timer: PropTypes.timer.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  timer: state.timer
});

export default connect(
  mapStateToProps,
  {  }
)(Timer);
*/