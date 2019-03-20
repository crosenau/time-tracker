import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Navbar.css';

class Navbar extends Component {
  render() {
    return (
      <div id='navbar'>
        <FontAwesomeIcon id='icon' icon='clock' />
        <nav>
        </nav>
      </div>
    );
  }
}

export default Navbar;