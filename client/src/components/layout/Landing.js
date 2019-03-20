import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';

import './Landing.css';
import Login from '../auth/Login';
import tomato from './tomato.svg';

const Landing = () => {
  return (
    <div className='landing'>
      <div className='intro'>
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
    </div>
  );
}

export default Landing;