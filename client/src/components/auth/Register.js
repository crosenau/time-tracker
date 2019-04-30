import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser, clearErrors } from '../../actions/authActions';

import './form.css';

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

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/chart');
    }
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
      <div className='form-container'>
        <div className='elements-container'>
          <h2>Registration</h2>
          <form onSubmit={this.onSubmit}>
          <div className='field-container'>
              <label htmlFor='name'>Please enter your name</label>
              <input
                type='text'
                id='name'
                value={this.state.name}
                onChange={this.handleChange}
              />
              <span className='error'>{errors.name}</span>
            </div>
            <div className='field-container'>
              <label htmlFor='email'>Email Address</label>
              <input
                type='email'
                id='email'
                value={this.state.email}
                onChange={this.handleChange}
              />
              <span className='error'>{errors.email}</span>
            </div>
            <div className='field-container'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                value={this.state.password}
                onChange={this.handleChange}
              />
              <span className='error'>{errors.password}</span>
            </div>
            <div className='field-container'>
              <label htmlFor='password2'>Confirm Password</label>
              <input
                type='password'
                id='password2'
                value={this.state.password2}
                onChange={this.handleChange}
              />
              <span className='error'>{errors.password2}</span>
            </div>
            <button
              className='submit-btn'
              type='submit'
            >
              REGISTER
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
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser, clearErrors }
)(withRouter(Register));