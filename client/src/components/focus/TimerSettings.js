import React, { Component } from 'react';

import './TimerSettings.css';


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

    this.resetFields();

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidUpdate() {
    console.log('componentDidUpate');
    //this.resetFields();
  }

  handleChange(event) {
    console.log(event);
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSelect(event) {
   this.setState({
     alarm: event.target.value 
   });
  }

  save() {
    let settings = {
      task: this.state.task,
      sessionLength: Number(this.state.sessionLength) * 60,
      shortBreakLength: Number(this.state.shortBreakLength) * 60,
      longBreakLength: Number(this.state.longBreakLength) * 60,
      setLength: Number(this.state.setLength),
      goal: Number(this.state.goal),
      alarm: this.state.alarm,
      tick: this.state.tick
    };

    this.props.updateSettings(settings);
    this.props.toggleSettings();
  }

  cancel() {
    this.resetFields();
    this.props.toggleSettings();
  }

  resetFields() {
    this.state = {
      task: this.props.task,
      sessionLength: String(this.props.sessionLength / 60),
      shortBreakLength: String(this.props.shortBreakLength / 60),
      longBreakLength: String(this.props.longBreakLength / 60),
      setLength: this.props.setLength,
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
                id='sessionLength' 
                type='number' 
                min='1' 
                max='60' 
                value={this.state.sessionLength}
                onChange={this.handleChange}
              />
            </div>
            <div className='num-input'>
              <h4>Short Break</h4>
              <input
              id='shortBreakLength'
              type='number'
              min='1' max='60'
              value={this.state.shortBreakLength}
              onChange={this.handleChange}
            />
            </div>
            <div className='num-input'>
              <h4>Long Break</h4>
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
            <h3>Sessions</h3>
            <div className='num-input'>
              <h4>Sessions per Long Break</h4>
              <input
                id='setLength'
                type='number'
                min='1'
                value={this.state.setLength}
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
              <select onChange={this.handleSelect}>
                {alarmSounds.map((sound, i) => <option key={i} id={sound.name} value={sound.url}>{sound.name}</option>)}
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