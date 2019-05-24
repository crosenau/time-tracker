import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Intro from './Intro';
import Login from './Login';
import Register from './Register';

import styles from './auth.module.css';

class Auth extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/chart');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/chart');
    }
  }

  render() {
    const { location } = this.props;

    return (
      <div className={styles.container}>
        <Intro />
        {['/', '/login'].includes(location.pathname) && <Login />}
        {location.pathname === '/register' && <Register />}
      </div>
    );
  }
}

Auth.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Auth);