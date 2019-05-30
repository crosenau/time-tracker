import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';

import { Provider } from 'react-redux';
import store from './store';

import Timer from './components/timer/Timer';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import Navbar from './components/navbar/Navbar';
import Auth from './components/auth/Auth';
import Chart from './components/chart/Chart';
import TimerUI from './components/timerUI/TimerUI';

import styles from './styles/App.module.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faEllipsisV,
  faForward,
  faUndoAlt,
  faPlay,
  faPause,
  faTimes,
  faSignOutAlt,
  faBullseye,
  faLayerGroup,
  faClipboardList,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { faClock, faChartBar } from '@fortawesome/free-regular-svg-icons';

library.add(
  faClock,
  faEllipsisV,
  faForward,
  faUndoAlt,
  faPlay,
  faPause,
  faTimes,
  faClock,
  faChartBar,
  faSignOutAlt,
  faBullseye,
  faLayerGroup,
  faClipboardList,
  faChartLine
);

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

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className={styles.app}>
            <Timer />
            <AudioPlayer />
            <Navbar />
            <div id={styles.appBody}>
              <Route exact path={['/', '/login', '/register']} component={Auth} />
              <PrivateRoute path='/chart' component={Chart} />
              <PrivateRoute path='/timer' component={TimerUI} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
