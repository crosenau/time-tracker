import React, { Component } from 'react';

import './Focus.css';

class Timer extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      breakLength: 300,
      sessionLength: 1500,
      onBreak: false,
      timerIsActive: false,
      startTime: null,
      secondsRemaining: 1500
    };
  }

  startTimer() {
    if (this.state.timerIsActive) {
      return;
    }

    this.setState({
      timerIsActive: true
    });

    this.state.startTime = Date.now();

    const intervalId = setInterval(() => this.timerTick(intervalId), 500);
  }

  timerTick(intervalId) {
    if (!this.state.timerIsActive) {
      clearInterval(intervalId);
      this.playAlarm();
      this.switchTimer();
      return;
    }

    const secondsElapsed = Math.round((Date.now() - this.startTime) / 1000);
    const secondsRemaining = this.secondsRemaining - secondsElapsed;

    if (secondsReamining < 0) {
      clearInterval(intervalId);
      this.playAlarm();
      this.switchTimer();
      return;
    }

    this.setState({
      secondsRemaining
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
      onBreak: !onBreak,
      secondsReamining: seconds,
      timerIsActive: false
    });
    this.startTimer();
  }

  pauseTimer() {
    this.setState({
      timerIsActive: false
    });
  }

  updateTimerLength(event) {
    if (this.state.timerIsActive) {
      return;
    }

    // Handle inputs
  }

  resetApp() {
    const alarm = document.querySelector('#beep');
    
    alarm.pause();
    alarm.currentTime = 0;

    this.setState({
      breakLength: 300,
      sessionLength: 1500,
      onBreak: false,
      timerIsActive: false,
      startTime: null,
      secondsReamining: 1500
    });
  }

  percentRemaining() {
    if (this.state.onBreak) {
      return (this.state.secondsRemaining / this.state.breakLength) * 100;
    }

    return (this.state.secondsRemaining / this.state.sessionLength) * 100;
  }

  leadingZero(num) {
    if (String(num).length < 2) {
      return '0' + String(num);
    }

    return String(num);
  }

  render() {
    const minutesLeft = Math.floor(this.state.secondsRemaining / 60);
    const secondsLeft = this.state.secondsRemaining % 60;
    const timeLeft = `${this.leadingZero(minutesLeft)}:${this.leadingZero(secondsLeft)}`;
    const playButton = <button onClick={this.startTimer}>Play</button>
    const pauseButton = <button onClick={this.pauseTimer}>Pause</button>

    return (
      <div id='timer'>
        {/* <ProgressRing percent={this.percentRemaining()} /> */}
        <div id='timer-elements'>
          <div id='timer-label'>{this.state.onBreak ? 'Break' : 'Session'}</div>
          <div id='time-left'>{timeLeft}</div>

        </div>
      </div>
    );
  }

}