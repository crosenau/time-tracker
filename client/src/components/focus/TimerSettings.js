import React, { Component } from 'react';

import './TimerSettings.css';


const alarmSounds = [
  {
    name: 'Desk Bell',
    url: ''
  },
  { name: 'none',
    url: ''
  }
];

class TimerSettings extends Component {
  constructor(props) {
    super(props);

    this.resetFields();

    this.handleChange = this.handleChange.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidUpdate() {
    this.resetFields();
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  save() {
    this.props.updateSettings();
    this.props.toggleSettings();
  }

  cancel() {
    this.resetFields();
    this.props.toggleSettings();
  }

  resetFields() {
    this.state = {
      task: this.props.task,
      session: String(this.props.session / 60),
      shortBreak: String(this.props.shortBreak / 60),
      longBreak: String(this.props.longBreak / 60),
      set: this.props.set,
      goal: this.props.goal,
      alarm: this.props.alarm,
      tick: this.props.tick,
      active: this.props.active
    };
  }

  render() {
    const warning = <p id='warning'>Timer is currently running. Saving changes will stop the timer and update it's settings.</p>;

    return (
      <div id='timer-settings'>
        <div id='settings-elements'>
          <h2>Settings</h2>

          <div className='section'>
            <h3>Task</h3>
            <input
              id='task'
              type='text'
              value={this.state.task}
              onChange={this.handleChange}
            />
          </div>

          <div className='section'>
            <h3>Timer Length <span>(in minutes)</span></h3>
            <div className='num-input'>
              <h4>Session</h4>
              <input 
                id='session' 
                type='number' 
                min='1' 
                max='60' 
                value={this.state.session}
                onChange={this.handleChange}
              />
            </div>
            <div className='num-input'>
              <h4>Short Break</h4>
              <input
              id='shortBreak'
              type='number'
              min='1' max='60'
              value={this.state.shortBreak}
              onChange={this.handleChange}
            />
            </div>
            <div className='num-input'>
              <h4>Long Break</h4>
              <input
                id='longBreak'
                type='number'
                min='1'
                max='60'
                value={this.state.longBreak}
                onChange={this.handleChange}
              />
            </div>
          </div>
          
          <div className='section'>
            <h3>Sessions</h3>
            <div className='num-input'>
              <h4>Sessions per Long Break</h4>
              <input
                id='set'
                type='number'
                min='1'
                value={this.state.set}
                onChange={this.handleChange}
              />
            </div>
            <div className='num-input'>
              <h4>Daily Goal</h4>
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
            <div className='selection'>
              <h4>Alarm</h4>
              <select>
                {alarmSounds.map((sound, i) => <option key={i}>{sound.name}</option>)}
              </select>
            </div>
            <div className='selection'>
              <h4>Tick</h4>
              <select>
                <option value='whiteNoise'>White Noise</option>
                <option value='clock'>Clock</option>
                <option value='rain'>Rain</option>
                <option value='none'>None</option>
              </select>
            </div>
          </div>
          
          <div className='section'>
            {this.state.active ? warning : null}
            <button onClick={this.save}>Save</button>
            <button onClick={this.cancel}>Cancel</button>
            <button>Defaults</button>
          </div>
        </div>
      </div>
    );
  }
};

export default TimerSettings;