import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './form.css'

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: ''
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
          <h4>Log in now</h4>
          <form onSubmit={() => console.log('submit')}>
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
    );
  }
}

export default Login;