import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';

import { Provider } from 'react-redux';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons';

import './App.css';
// import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';


if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;

  setAuthToken(token);
  
  const decoded = jwt_decode(token);

  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());

    window.location.href = './login';
  }
}

library.add(faClock);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route path='/' component={Navbar} />
            <Route exact path={['/', '/login', '/register']} component={Landing} />
            <Route exact path={['/', '/login']} component={Login} />
            <Route exact path='/register' component={Register} />
            {/* <PrivateRoute path='/dashboard' component={Dashboard} /> */}
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
