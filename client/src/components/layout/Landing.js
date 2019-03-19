import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Landing.css';
import tomato from './tomato.svg';

class Landing extends Component {
  render() {
    return (
      <div className='landing'>
        <ul>
          <li>Set your goals</li>
          <li>Categorize your tasks</li>
          <li>Log and track your time</li>
          <br/>
          <img 
            src={tomato}
            alt='logo'
            width='400px'
            height='400px'
          />
        </ul>
      </div>
    );
  }
}

export default Landing;