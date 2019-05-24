import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser, clearErrors } from '../../actions/authActions';

import styles from './auth.module.css'

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
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

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.props;

    return (
      <div className={styles.formContainer}>
        <div className={styles.elementsContainer}>
          <h2>Registration</h2>
          <form onSubmit={this.onSubmit}>
          <div className={styles.fieldContainer}>
              <label htmlFor='name'>Please enter your name</label>
              <input
                type='text'
                id='name'
                value={this.state.name}
                onChange={this.handleChange}
              />
              <span className={styles.error}>{errors.name}</span>
            </div>
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
            <div className={styles.fieldContainer}>
              <label htmlFor='password2'>Confirm Password</label>
              <input
                type='password'
                id='password2'
                value={this.state.password2}
                onChange={this.handleChange}
              />
              <span className={styles.error}>{errors.password2}</span>
            </div>
            <button
              className={styles.submitBtn}
              type='submit'
            >
              Submit
            </button>
          </form>
          <p>
            Already have an account? <Link to='/login'>Log In Here</Link>
          </p>
        </div>
      </div>
    );
  }
};

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser, clearErrors }
)(withRouter(Register));