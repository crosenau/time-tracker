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

    this.state = {
      task: this.props.task,
      session: this.props.sessionLength / 60,
      shortBreak: this.props.shortBreakLength / 60,
      longBreak: this.props.longBreakLength / 60,
      set: this.props.setLength,
      goal: this.props.goal,
      alarm: this.props.alarm,
      tick: this.props.tick
    };
  }

  render() {
    return (
      <div id='timer-settings'>
        <div id='settings-elements'>
          <h2>Settings</h2>

          <div className='section'>
            <h3>Task</h3>
            <input id='task' type='text' defaultValue='Work'></input>
          </div>

          <div className='section'>
            <h3>Timer Length <span>(in minutes)</span></h3>
            <div id='one' className='num-input'>
              <h4>Session</h4>
              <input id='session' type='number' min='1' max='60' value='25' />
            </div>
            <div id='2' className='num-input'>
              <h4>Short Break</h4>
              <input id='shortBreak' type='number' min='1' max='60' value='5' />
            </div>
            <div id='3' className='num-input'>
              <h4>Long Break</h4>
              <input id='longBreak' type='number' min='1' max='60' value='15' />
            </div>
          </div>
          
          <div className='section'>
            <h3>Sessions</h3>
            <div className='num-input'>
              <h4>Sessions per Long Break</h4>
              <input id='set' type='number' min='1' value='4' />
            </div>
            <div className='num-input'>
              <h4>Daily Goal</h4>
              <input id='goal' type='number' min='1' value='12' />
            </div>
          </div>
          
          <div className='section'>
            <h3>Sounds</h3>
            <div className='selection'>
              <h4>Alarm</h4>
              <select>
                {alarmSounds.map(sound => <option>{sound.name}</option>)}
                {/*<option value='deskBell'>Desk Bell</option>
                <option value='chimes'>Chimes</option>
                <option value='alarmClock'>Alarm clock</option>
                <option value='none'>None</option>*/}
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
            <button onClick={this.props.updateSettings}>Save</button>
          </div>
        </div>
      </div>
    );
  }
};

export default TimerSettings;