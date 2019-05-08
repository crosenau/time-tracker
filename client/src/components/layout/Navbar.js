import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Navbar.module.css';


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
          <div id={styles.sections}>
            <NavLink 
              to='/timer'
              className={styles.navButton}
              activeClassName={styles.navButtonSelected} 
            >
              <span>
                <FontAwesomeIcon icon={['far', 'clock']} />
              </span>
            </NavLink>
            <NavLink 
              to='/chart'
              className={styles.navButton}
              activeClassName={styles.navButtonSelected} 
            >
              <span>
                <FontAwesomeIcon icon={['far', 'chart-bar']} />
              </span>
            </NavLink>
          </div>
          <button
            className={styles.navButton}
            onClick={this.handleClick}
          >
            <span>
              <FontAwesomeIcon icon='sign-out-alt' />
            </span>
          </button>
        </nav>
        );
    } else {
      navOpts = (
        <nav>
          <NavLink
            to='/login'
            className={styles.navButton}
            activeClassName={styles.navButtonSelected}
            >
              Log in
          </NavLink>
          <NavLink 
            to='/register'
            className={styles.navButton}
            activeClassName={styles.navButtonSelected}
          >
            Register
          </NavLink>  
        </nav>
      );
    }

    return (
      <div id={styles.navbar}>
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