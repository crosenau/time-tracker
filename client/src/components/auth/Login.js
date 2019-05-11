import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser, clearErrors } from '../../actions/authActions';

import './form.css'
import Landing from './Landing';

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
      <div className='container'>
        <Landing />
        <div className='form-container'>
          <div className='elements-container'>
            <h2>Log in now</h2>
            <form onSubmit={this.onSubmit}>
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
              <button
                className='submit-btn'
                type='submit'
              >
                LOG IN
              </button>
            </form>
            <p>
              Don't have an account? <Link to='/register'>Register Here</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
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
  { loginUser, clearErrors }
)(Login);