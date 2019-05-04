import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './ProgressRing.module.css';

function leadingZero(num) {
  if (String(num).length < 2) {
    return '0' + String(num);
  }

  return String(num);
}

class ProgressRing extends Component {
  constructor() {
    super();
  }

  renderProgressRing() {
    const minutes = Math.floor(this.props.timer.timeLeft / 60);
    const seconds = this.props.timer.timeLeft % 60;
    const timeLeft = `${leadingZero(minutes)}:${leadingZero(seconds)}`;

    const offset = this.circumference - this.circumference * this.percentRemaining() / 100;

    const svgDiameter = 400;
    const diameter = svgDiameter * 0.90;
    const radius = diameter / 2;
    const center = svgDiameter / 2;
    const circumference = 2 * Math.PI * radius;

    return (
      <svg
        width='100%'
        height='100%'
        viewBox={`0 0 ${svgDiameter} ${svgDiameter}`}
      >
        <circle
          id={styles.backgroundCircle}
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          id={styles.progressRing}
          r={radius}
          cx={center}
          cy={center}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={-offset}
        />
        <text
          x={center}
          y={center * 1.2}
          textAnchor='middle'
        >
          {timeLeft}
        </text>
      </svg>
    );

  }

  percentRemaining() {
    switch (this.props.timer.currentTimer) {
     case 'Task':
       return (this.props.timer.timeLeft / this.props.timer.taskLength) * 100;
     case 'Break':
       return (this.props.timer.timeLeft / this.props.timer.shortBreakLength) * 100;
     case 'Long Break':
       return (this.props.timer.timeLeft / this.props.timer.longBreakLength) * 100;
    }
  }

  render() {
    return (
      <div id={styles.container} ref={this.svgContainer}>
        {this.renderProgressRing()}
      </div>
    );
  }
};

ProgressRing.propTypes = {
  timer: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  timer: state.timer
});

export default connect(
  mapStateToProps,
  {}
)(ProgressRing);