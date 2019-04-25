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

const task = 'task';
const shortBreak = 'Break';
const longBreak = 'Long Break';

class ProgressRing extends Component {
  constructor() {
    super();

    this.state = {};

    this.node = React.createRef();
  }

  componentDidMount() {
    const node = this.node.current;

    this.svgDiameter = Number(getComputedStyle(node).width.replace('px', ''));
    this.diameter = this.svgDiameter * 0.90;
    this.radius = this.diameter / 2;
    this.center = this.svgDiameter / 2;
    this.circumference = 2 * Math.PI * this.radius;

    // Force component to re-render once computed dimensions are computed
    this.setState(this.state); 
  }

  renderProgressRing() {
    if (!this.diameter) {
      return null;
    }

    const minutes = Math.floor(this.props.timer.timeRemaining / 60);
    const seconds = this.props.timer.timeRemaining % 60;
    const timeLeft = `${leadingZero(minutes)}:${leadingZero(seconds)}`;

    const offset = this.circumference - this.circumference * this.percentRemaining() / 100;

    return (
      <svg
        width={this.svgDiameter}
        height={this.svgDiameter}
      >
        <circle
          id={styles.backgroundCircle}
          r={this.radius}
          cx={this.center}
          cy={this.center}
        />
        <circle
          id={styles.progressRing}
          r={this.radius}
          cx={this.center}
          cy={this.center}
          strokeDasharray={`${this.circumference} ${this.circumference}`}
          strokeDashoffset={-offset}
        />
        <text
          x={this.center}
          y={this.center * 1.2}
          textAnchor='middle'
        >
          {timeLeft}
        </text>
      </svg>
    );

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
    return (
      <div id={styles.container} ref={this.node}>
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