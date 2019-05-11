import React from 'react';

import Login from './Login';
import Register from './Register';

import './Landing.css';
import landing from '../../assets/images/landing.png';

const Landing = (props) => {
  return (
    <div className='intro'>
      <div className='list'>
        <ul>
          <li>Set your goals</li>
          <li>Categorize your tasks</li>
          <li>Log and track your time</li>
        </ul>
      </div>
      <div id='images'>
          <img
            id='chart'
            src={landing}
            alt='Bar Chart'
          />
        </div>
    </div>
  );
}

export default Landing;