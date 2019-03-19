import React, { Component } from 'react';


import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Landing />
        <Login />
      </div>
    );
  }
}

export default App;
