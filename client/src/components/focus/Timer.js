import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import actions

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import css
import './Timer.css'
import ProgressRing from './ProgressRing';
import TimerSettings from './TimerSettings';

class Timer extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      task: 'Work',
      shortBreakLength: 5 * 60,
      longBreakLength: 15 * 60,
      sessionLength: 25 * 60,
      setLength: 4,
      goal: 12,
      alarm: null, // url
      tick: null, // url
      completedSessions: 0,
      settings: false,
      onBreak: false,
      intervalId: 0,
      timeRemaining: 25 * 60,
      startTime: null,
      timeRemainingAtStart: null,
    };

    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }

  startTimer() {
    console.log('startTimer');
    if (this.state.intervalId) {
      return;
    }

    const startTime = Date.now();
    const intervalId = setInterval(() => this.timerTick(), 1000);

    this.setState({
      timeRemainingAtStart: this.state.timeRemaining,
      startTime,
      intervalId
    });
  }

  timerTick() {
    console.log('timerTick');
    let length = this.state.timeRemainingAtStart

    const secondsElapsed = Math.round((Date.now() - this.state.startTime) / 1000);
    const timeRemaining = length - secondsElapsed;

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
    alarm.currentTime = 0;
    alarm.play();
  }

  switchTimer() {
    let seconds = this.state.onBreak ? this.state.sessionLength : this.state.breakLength;

    this.setState({
      onBreak: !this.state.onBreak,
      timeRemaining: seconds,
    });
    this.startTimer();
  }

  stopTimer() {
    clearInterval(this.state.intervalId);

    this.setState({
      intervalId: 0
    });
  }

  updateSettings(event) {
    if (this.state.intervalId) {
      return;
    }

    // Handle inputs
  }

  resetApp() {
    const alarm = document.querySelector('#beep');
    
    alarm.pause();
    alarm.currentTime = 0;

    this.setState({
      breakLength: 5 * 60,
      sessionLength: 25 * 60,
      onBreak: false,
      intervalId: 0,
      startTime: null,
      secondsReamining: 25 * 60
    });
  }

  percentRemaining() {
    if (this.state.onBreak) {
      return (this.state.timeRemaining / this.state.breakLength) * 100;
    }

    return (this.state.timeRemaining / this.state.sessionLength) * 100;
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
        session={this.state.sessionLength}
        shortBreak={this.state.shortBreakLength}
        longBreak={this.state.longBreakLength}
        set={this.state.setLength}
        goal={this.state.goal}
        alarm={this.state.alarm}
        tick={this.state.tick}
        active={Boolean(this.state.intervalId)}
        toggleSettings={this.toggleSettings}
        updateSettings={this.updateSettings}
      />;

    return (
      <div id='timer'>
        {this.state.settings ? settings : null}
        <ProgressRing percent={this.percentRemaining()} />
        <div id='timer-elements'>
          <div id='timer-label'>{this.state.onBreak ? 'Break' : 'Session'}</div>
          <div id='time-left'>{timeLeft}</div>
          {this.state.intervalId ? pauseButton : playButton}
          <button class='icon-btn' id='settings-btn' onClick={this.toggleSettings}>
            <FontAwesomeIcon icon='cog' />    
          </button>
          <audio id='beep' src='https://res.cloudinary.com/carpol/video/upload/v1542177884/Pomodoro%20Clock/78506__joedeshon__desk-bell-one-time-01.mp3' />
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