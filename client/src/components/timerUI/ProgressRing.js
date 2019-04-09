import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function leadingZero(num) {
  if (String(num).length < 2) {
    return '0' + String(num);
  }

  return String(num);
}

const task = 'task';
const shortBreak = 'Break';
const longBreak = 'Long Break';

class ProgressRing extends Component {
  constructor() {
    super();

    this.smallest = Math.min(window.innerWidth, window.innerHeight)
    this.diameter = Math.floor(this.smallest / 3);
    this.stroke = 8;
    this.radius = this.diameter / 2 - this.stroke;
    this.center = this.diameter / 2;
    this.circumference = 2 * Math.PI * this.radius;
    this.ringStyle = {
      strokeDasharray: `${this.circumference} ${this.circumference}`,
      transform: 'rotate(-90deg)',
      transformOrigin: '50% 50%'
    };
  }

  percentRemaining() {
    switch (this.props.timer.currentTimer) {
     case task:
       return (this.props.timer.timeRemaining / this.props.timer.taskLength) * 100;
     case shortBreak:
       return (this.props.timer.timeRemaining / this.props.timer.shortBreakLength) * 100;
     case longBreak:
       return (this.props.timer.timeRemaining / this.props.timer.longBreakLength) * 100;
    }
  }

  render() {
    const minutesLeft = Math.floor(this.props.timer.timeRemaining / 60);
    const secondsLeft = this.props.timer.timeRemaining % 60;
    const timeLeft = `${leadingZero(minutesLeft)}:${leadingZero(secondsLeft)}`;

    const ring = document.querySelector('#progress-ring-circle');
    
    if (ring) {
      const offset = this.circumference - this.circumference * this.percentRemaining() / 100; 
      ring.style.strokeDashoffset = -offset;
    }

    return (
      <div id='progress-ring'>
      <svg
        width={this.diameter}
        height={this.diameter}
        style={{ fontSize: `${this.diameter / 5}px` }}
      >
        <circle
          id='background-circle'
          stroke='#999'
          strokeWidth={this.stroke}
          fill='transparent'
          r={this.radius}
          cx={this.center}
          cy={this.center}
          style={this.ringStyle}
        />
        <circle
          id='progress-ring-circle'
          stroke='#4520d9ff'
          strokeWidth={this.stroke * 2}
          fill='transparent'
          r={this.radius}
          cx={this.center}
          cy={this.center}
          style={this.ringStyle}
        />
        <text
          x={this.center}
          y={this.center * 1.15}
          textAnchor='middle'
          fill='black'
        >
          {timeLeft}
        </text>
      </svg>
      </div>
    );
  }
};

//export default ProgressRing;

ProgressRing.propTypes = {
  timer: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  timer: state.timer
});

export default connect(
  mapStateToProps,
  { }
)(ProgressRing);