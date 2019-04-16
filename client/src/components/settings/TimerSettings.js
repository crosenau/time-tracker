import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  startTimer,
  stopTimer,
  updateTimeRemaining,
  nextTimer,
  resetCurrentTimer,
  updateSettings,
  toggleTimerSettings
} from '../../actions/timerActions';

import './settings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const alarmSounds = [
  {
    name: 'Desk Bell',
    url: 'https://res.cloudinary.com/carpol/video/upload/v1542177884/Pomodoro%20Clock/78506__joedeshon__desk-bell-one-time-01.mp3'
  },
  { name: 'none',
    url: ''
  }
];

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
    this.handleSelect = this.handleSelect.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSelect(event) {
   this.setState({
     alarmSound: event.target.value 
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

    this.props.stopTimer();
    this.props.updateSettings(settings);
    this.props.toggleTimerSettings();
    this.props.resetCurrentTimer();
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
    const warning = <p id='warning'>Timer is currently running. Saving changes will stop the timer and update it's settings.</p>;

    return (
      <div id='overlay'>
        <div id='settings'>
          <div id='header'>
            <h2>Settings</h2>
            <button
              className='icon-btn'
              onClick={this.cancel}
            >
              <FontAwesomeIcon icon={'times'} />
            </button>
          </div>

          <div className='section'>
            <div className='input-container'>
              <label
                htmlFor='taskName'
              >
                Task
              </label>
              <input
                id='taskName'
                type='text'
                value={this.state.taskName}
                onChange={this.handleChange}
              />
            </div>
          </div>

          <div className='section'>
            <h3>Timer Length <span>(in minutes)</span></h3>
            <div className='input-container'>
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
            <div className='input-container'>
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
            <div className='input-container'>
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
          
          <div className='section'>
            <h3>Tasks</h3>
            <div className='input-container'>
              <label
                htmlFor='setLength'
              >
                Tasks per Long Break
              </label>
              <input
                id='setLength'
                type='number'
                min='1'
                value={this.state.setLength}
                onChange={this.handleChange}
              />
            </div>
            <div className='input-container'>
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
          
          <div className='section'>
            <h3>Sounds</h3>
            <div className='input-container'>
              <label
                htmlFor='alarm'
              >
                Alarm
              </label>
              <select
                id='alarm'
                onChange={this.handleSelect}
              >
                {alarmSounds.map((sound, i) => <option key={i} id={sound.name} value={sound.url}>{sound.name}</option>)}
              </select>
            </div>
            <div className='input-container'>
              <label
                htmlFor='tick'
              >
                Tick
              </label>
              <select
                id='tick'
              >
                <option value='whiteNoise'>White Noise</option>
                <option value='clock'>Clock</option>
                <option value='rain'>Rain</option>
                <option value='none'>None</option>
              </select>
            </div>
          </div>
          
          <div className='section'>
            {this.props.timer.active ? warning : null}
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
    updateTimeRemaining,
    nextTimer,
    resetCurrentTimer,
    updateSettings,
    toggleTimerSettings
  }
)(TimerSettings);