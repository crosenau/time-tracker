import React, { Component } from 'react';

import './Login.css'

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: ''
    };
  }

  onChange(event) {
    console.log(event);
    //this.setState({});
  }

  render() {
    return (
      <div className='container'>
        <h4>Login now</h4>
        <form onSubmit={() => console.log('submit')}>
          <div className='field-container'>
            <label htmlFor='email'>Email Address</label>
            <input
              type='email'
              id='email'
            />
          </div>
          <div className='field-container'>
            <label htmlFor='password'>Password</label>
            <input
              type='text'
              id='password'
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Login;