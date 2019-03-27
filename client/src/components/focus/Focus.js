import React, { Component } from 'react';

import Timer from './Timer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Focus.css';

class Focus extends Component {
  render() {
    return (
      <div id='focus'>
        <button class='icon-btn' id='settings-btn'>
          <FontAwesomeIcon icon='cog' />    
        </button>
        <Timer />
      </div>
    );
  }
}

export default Focus;