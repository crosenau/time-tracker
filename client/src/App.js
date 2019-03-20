import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

library.add(faClock);

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path={['/', '/login', '/register']} component={Landing} />
          <Route exact path={['/', '/login']} component={Login} />
          <Route exact path={'/register'} component={Register} />
        </div>
      </Router>
    );
  }
}

export default App;
