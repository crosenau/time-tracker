import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './form.css';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      password2: ''
    };

    this.update = this.update.bind(this);
  }

  update(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  render() {
    return (
      <div className='form-container'>
        <div className='elements-container'>
          <h4>Registration</h4>
          <form onSubmit={() => console.log('submit')}>
          <div className='field-container'>
              <label htmlFor='name'>Please enter your name</label>
              <input
                type='text'
                id='name'
                value={this.state.name}
                onChange={this.update}
              />
            </div>
            <div className='field-container'>
              <label htmlFor='email'>Email Address</label>
              <input
                type='email'
                id='email'
                value={this.state.email}
                onChange={this.update}
              />
            </div>
            <div className='field-container'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                value={this.state.password}
                onChange={this.update}
              />
            </div>
            <div className='field-container'>
              <label htmlFor='password2'>Confirm Password</label>
              <input
                type='password'
                id='password2'
                value={this.state.password2}
                onChange={this.update}
              />
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

export default Register;