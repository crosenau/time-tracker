import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser, clearErrors } from '../../actions/authActions';

import styles from './auth.module.css'

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  onSubmit(event) {
    event.preventDefault();

    const login = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(login);
  }

  render() {
    const { errors } = this.props;
    
    return (
      <div className={styles.formContainer}>
        <div className={styles.elementsContainer}>
          <h2>Log in now</h2>
          <form onSubmit={this.onSubmit}>
            <div className={styles.fieldContainer}>
              <label htmlFor='email'>Email Address</label>
              <input
                type='email'
                id='email'
                value={this.state.email}
                onChange={this.handleChange}
              />
              <span className={styles.error}>{errors.email}</span>
            </div>
            <div className={styles.fieldContainer}>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                value={this.state.password}
                onChange={this.handleChange}
              />
              <span className={styles.error}>{errors.password}</span>
            </div>
            <button
              className={styles.submitBtn}
              type='submit'
            >
              Log in
            </button>
          </form>
          <p>
            Don't have an account? <Link to='/register'>Register Here</Link>
          </p>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser, clearErrors }
)(Login);