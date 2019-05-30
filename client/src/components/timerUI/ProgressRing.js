import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { digitalTime, toSeconds } from '../../utils/formatMilliseconds';

import styles from '../../styles/ProgressRing.module.css';

class ProgressRing extends Component {
  renderProgressRing() {
    const svgDiameter = 400;
    const diameter = svgDiameter * 0.90;
    const radius = diameter / 2;
    const center = svgDiameter / 2;
    const circumference = 2 * Math.PI * radius;

    const offset = circumference - circumference * this.percentRemaining() / 100;

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
          {digitalTime(this.props.timer.timeLeft)}
        </text>
      </svg>
    );
  }

  percentRemaining() {
    const { timer } = this.props;
    const timeLeft = toSeconds(timer.timeLeft);
    const taskLength = toSeconds(timer.taskLength);
    const shortBreakLength = toSeconds(timer.shortBreakLength);
    const longBreakLength = toSeconds(timer.longBreakLength);

    switch (timer.currentTimer) {
      case 'Task': {
        return (timeLeft / taskLength) * 100;
      }
      case 'Break': {
        return (timeLeft / shortBreakLength) * 100;
      }
      case 'Long Break': {
        return (timeLeft / longBreakLength) * 100;
      }
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