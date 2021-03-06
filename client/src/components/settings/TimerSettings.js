import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  startTimer,
  stopTimer,
  updateTimeLeft,
  nextTimer,
  resetCurrentTimer,
  saveSettings,
  toggleTimerSettings,
  updateErrors
} from '../../actions/timerActions';

import toMilliseconds from '@sindresorhus/to-milliseconds';
import { toMinutes } from '../../utils/formatMilliseconds';

import isEmpty from 'is-empty';

import alarmSounds from './alarmSounds';
import tickSounds from './tickSounds';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../../styles/settings.module.css';
import appStyles from '../../styles/App.module.css';


class TimerSettings extends Component {
  constructor(props) {
    super(props);

    const { timer } = this.props;

    this.state = {
      taskName: timer.taskName,
      taskLength: String(toMinutes(timer.taskLength)),
      shortBreakLength: String(toMinutes(timer.shortBreakLength)),
      longBreakLength: String(toMinutes(timer.longBreakLength)),
      setLength: timer.setLength,
      goal: timer.goal,
      alarmSound: timer.alarmSound,
      tickSound: timer.tickSound,
      isValid: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.revert = this.revert.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.defaults = this.defaults.bind(this);
  }

  componentWillUnmount() {
    this.props.updateErrors({});
  }

  handleChange(event) {
    const { errors, isValid } = this.validateInput({
      ...this.state,
      [event.target.id]: event.target.value
    });

    if (!(isEmpty(this.props.errors) && isEmpty(errors))) {
      this.props.updateErrors(errors);
    }

    this.setState({
      [event.target.id]: event.target.value,
      isValid
    });
  }

  validateInput(data) {
    const errors = {};

    if (isEmpty(data.taskName)) {
      errors.taskName = 'Task name is required'
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }

  save() {
    let settings = {
      taskName: this.state.taskName,
      taskLength: toMilliseconds({ minutes: Number(this.state.taskLength) }),
      shortBreakLength: toMilliseconds({ minutes: Number(this.state.shortBreakLength) }),
      longBreakLength: toMilliseconds({ minutes: Number(this.state.longBreakLength) }),
      setLength: Number(this.state.setLength),
      goal: Number(this.state.goal),
      alarmSound: this.state.alarmSound,
      tickSound: this.state.tickSound
    };

    this.props.saveSettings(settings);
    this.props.toggleTimerSettings();
  }

  cancel() {
    this.revert();
    this.props.toggleTimerSettings();
  }

  revert() {
    const { timer } = this.props;

    this.setState({
      taskName: timer.taskName,
      taskLength: String(toMinutes(timer.taskLength)),
      shortBreakLength: String(toMinutes(timer.shortBreakLength)),
      longBreakLength: String(toMinutes(timer.longBreakLength)),
      setLength: timer.setLength,
      goal: timer.goal,
      alarmSound: timer.alarmSound,
      tickSound: timer.tickSound,
      isValid: true
    });
  }

  defaults() {
    this.setState({
      taskName: 'Work',
      taskLength: '25',
      shortBreakLength: '5',
      longBreakLength: '15',
      setLength: '4',
      goal: '12',
      alarmSound: alarmSounds[0].url,
      tickSound: '',
      isValid: true
    });

    this.props.updateErrors({});
  }

  render() {
    const { errors } = this.props;

    return (
      <div id={styles.overlay}>
        <div id={styles.settings}>
          <div id={styles.header}>
            <h2>Settings</h2>
            <button
              className={appStyles.iconButton}
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
            <span className={styles.error}>{null || errors.taskName}</span>
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
            {
              this.state.isValid ?
               <button className={appStyles.darkButton} onClick={this.save}>Save</button> :
               <button className={appStyles.darkButton} disabled>Save</button>
            }            
            <button className={appStyles.darkButton} onClick={this.cancel}>Cancel</button>
            <button className={appStyles.darkButton} onClick={this.defaults}>Defaults</button>
          </div>
        </div>
      </div>
    );
  }
};

TimerSettings.propTypes = {
  timer: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  timer: state.timer,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { 
    startTimer,
    stopTimer,
    updateTimeLeft,
    nextTimer,
    resetCurrentTimer,
    saveSettings,
    toggleTimerSettings,
    updateErrors
  }
)(TimerSettings);