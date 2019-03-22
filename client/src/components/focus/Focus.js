import React, { Component } from 'react';

import Timer from './Timer';

import './Focus.css';

class Focus extends Component {
  render() {
    return (
      <div id='focus'>
        <Timer />
      </div>
    );
  }
}

export default Focus;