import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Navbar.css';


class Navbar extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.logoutUser();
    this.props.history.push('/');
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    let navOpts;

    if (isAuthenticated) {
      navOpts = (
        <nav>
          <NavLink 
            to='/dashboard'
            className='nav-btn'
            activeClassName='nav-btn-selected' 
          >
            Dashboard
          </NavLink>
          <NavLink 
            to='/focus'
            className='nav-btn'
            activeClassName='nav-btn-selected' 
          >
            Focus
          </NavLink>
          <button
            className='nav-btn'
            onClick={this.handleClick}
          >
            Log out
          </button>
        </nav>
        );
    } else {
      navOpts = (
        <nav>
          <NavLink
            to='/login'
            className='nav-btn'
            activeClassName='nav-btn-selected'
            >
              Log in
          </NavLink>
          <NavLink 
            to='/register'
            className='nav-btn'
            activeClassName='nav-btn-selected'
          >
            Register
          </NavLink>  
        </nav>
      );
    }

    return (
      <div id='navbar'>
        <FontAwesomeIcon id='icon' icon='clock' />
        {navOpts}
      </div>
    );
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);