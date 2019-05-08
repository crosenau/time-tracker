import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  startTimer,
  stopTimer,
  updatetimeLeft,
  nextTimer,
  resetCurrentTimer,
  updateSettings,
  toggleTimerSettings
} from '../../actions/timerActions';

import alarmSounds from './alarmSounds';
import tickSounds from './tickSounds';

import styles from './settings.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class TimerSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      taskName: this.props.timer.taskName,
      taskLength: String(this.props.timer.taskLength / 60),
      shortBreakLength: String(this.props.timer.shortBreakLength / 60),
      longBreakLength: String(this.props.timer.longBreakLength / 60),
      setLength: this.props.timer.setLength,
      goal: this.props.timer.goal,
      alarmSound: this.props.timer.alarmSound,
      tickSound: this.props.timer.tickSound,
    };

    this.handleChange = this.handleChange.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  save() {
    let settings = {
      taskName: this.state.taskName,
      taskLength: Number(this.state.taskLength) * 60,
      shortBreakLength: Number(this.state.shortBreakLength) * 60,
      longBreakLength: Number(this.state.longBreakLength) * 60,
      setLength: Number(this.state.setLength),
      goal: Number(this.state.goal),
      alarmSound: this.state.alarmSound,
      tickSound: this.state.tickSound
    };

    const { taskLength, shortBreakLength, longBreakLength, currentTimer } = this.props.timer;
    let timerChanged = false; 

    if (currentTimer === 'Task' && taskLength !== settings.taskLength) {
      timerChanged = true;
    } else if (currentTimer === 'Break' && shortBreakLength !== settings.shortBreakLength) {
      timerChanged = true;
    } else if (currentTimer === 'Long Break' && longBreakLength !== settings.longBreakLength) {
      timerChanged = true;
    }

    if (timerChanged && this.props.timer.active) {
      this.props.stopTimer();
    }

    this.props.updateSettings(settings);
    timerChanged && this.props.resetCurrentTimer();
    this.props.toggleTimerSettings();
  }

  cancel() {
    this.resetFields();
    this.props.toggleTimerSettings();
  }

  resetFields() {
    this.setState({
      taskName: this.props.timer.taskName,
      taskLength: String(this.props.timer.taskLength / 60),
      shortBreakLength: String(this.props.timer.shortBreakLength / 60),
      longBreakLength: String(this.props.timer.longBreakLength / 60),
      setLength: this.props.timer.setLength,
      goal: this.props.timer.goal,
      alarmSound: this.props.timer.alarmSound,
      tickSound: this.props.timer.tickSound
    });
  }

  render() {
    return (
      <div id={styles.overlay}>
        <div id={styles.settings}>
          <div id={styles.header}>
            <h2>Settings</h2>
            <button
              className='icon-btn'
              onClick={this.cancel}
            >
              <FontAwesomeIcon icon={'times'} />
            </button>
          </div>

          <div className={styles.section}>
            <div className={styles.inputContainer}>
              <label
                htmlFor='taskName'
              >
                Task Name
              </label>
              <input
                id='taskName'
                type='text'
                maxLength='16'
                value={this.state.taskName}
                onChange={this.handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3>Timer Length <span>(in minutes)</span></h3>
            <div className={styles.inputContainer}>
              <label
                htmlFor='taskLength'
              >
                Task
              </label>
              <input 
                id='taskLength' 
                type='number' 
                min='1' 
                max='60' 
                value={this.state.taskLength}
                onChange={this.handleChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <label
                htmlFor='shortBreakLength'
              >
                Short Break
              </label>
              <input
                id='shortBreakLength'
                type='number'
                min='1' max='60'
                value={this.state.shortBreakLength}
                onChange={this.handleChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <label
                htmlFor='longBreakLength'
              >
                Long Break
              </label>
              <input
                id='longBreakLength'
                type='number'
                min='1'
                max='60'
                value={this.state.longBreakLength}
                onChange={this.handleChange}
              />
            </div>
          </div>
          
          <div className={styles.section}>
            <h3>Tasks</h3>
            <div className={styles.inputContainer}>
              <label
                htmlFor='setLength'
              >
                Set Length
              </label>
              <input
                id='setLength'
                type='number'
                min='1'
                value={this.state.setLength}
                onChange={this.handleChange}
              />
            </div>
            <div className={styles.inputContainer}>
              <label
                htmlFor='goal'
              >
                Daily Goal
              </label>
              <input
                id='goal'
                type='number'
                min='1'
                value={this.state.goal}
                onChange={this.handleChange} 
              />
            </div>
          </div>
          
          <div className={styles.section}>
            <h3>Sounds</h3>
            <div className={styles.inputContainer}>
              <label
                htmlFor='alarmSound'
              >
                Alarm
              </label>
              <select
                id='alarmSound'
                value={this.state.alarmSound}
                onChange={this.handleChange}
              >
                {alarmSounds.map((sound, i) => 
                  <option 
                    key={i}
                    id={sound.name}
                    value={sound.url}
                  >
                    {sound.name}
                  </option>)}
              </select>
            </div>
            <div className={styles.inputContainer}>
              <label
                htmlFor='tickSound'
              >
                Tick
              </label>
              <select
                id='tickSound'
                value={this.state.tickSound}
                onChange={this.handleChange}
              >
                {tickSounds.map((sound, i) =>
                    <option
                      key={i}
                      id={sound.name}
                      value={sound.url}
                    >
                      {sound.name}
                    </option>
                )}
              >
              </select>
            </div>
          </div>
          
          <div className={styles.section}>
            <button onClick={this.save}>Save</button>
            <button onClick={this.cancel}>Cancel</button>
            <button>Defaults</button>
          </div>
        </div>
      </div>
    );
  }
};

TimerSettings.propTypes = {
  timer: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
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
    updateSettings,
    toggleTimerSettings
  }
)(TimerSettings);