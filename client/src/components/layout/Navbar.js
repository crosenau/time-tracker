import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './Navbar.module.css';


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
            to='/chart'
            className={style.navButton}
            activeClassName={style.navButtonSelected} 
          >
            Chart
          </NavLink>
          <NavLink 
            to='/timer'
            className={style.navButton}
            activeClassName={style.navButtonSelected} 
          >
            Timer
          </NavLink>
          <button
            className={style.navButton}
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
            className={style.navButton}
            activeClassName={style.navButtonSelected}
            >
              Log in
          </NavLink>
          <NavLink 
            to='/register'
            className={style.navButton}
            activeClassName={style.navButtonSelected}
          >
            Register
          </NavLink>  
        </nav>
      );
    }

    return (
      <div id={style.navbar}>
        <div id={style.clock}>
          <FontAwesomeIcon icon='clock' />
        </div>
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