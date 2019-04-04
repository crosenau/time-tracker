import axios from 'axios';

import {
  START_TIMER,
  UPDATE_TIME_REMAINING,
  NEXT_TIMER,
  STOP_TIMER,
  RESET_CURRENT_TIMER,
  ADD_COMPLETED_SESSION,
  CLEAR_COMPLETED_SESSIONS,
  SAVE_COMPLETED_SESSIONS,
  UPDATE_SETTINGS,
  TOGGLE_SETTINGS_DISPLAY
} from './types';

export function startTimer() {
  return {
    type: START_TIMER
  };
}

export function stopTimer() {
  return {
    type: STOP_TIMER
  };
}

export function updateTimeRemaining() {
  return {
    type: UPDATE_TIME_REMAINING
  };
}

export function nextTimer() {
  return {
    type: NEXT_TIMER
  }
}

export function resetCurrentTimer() {
  return {
    type: RESET_CURRENT_TIMER
  };
}

export function addCompletedSession(session) {
  return {
    type: ADD_COMPLETED_SESSION,
    payload: session
  };
}

export function clearCompletedSessions() {
  return {
    type: CLEAR_COMPLETED_SESSIONS
  };
}

export function saveCompletedSessions(sessions) {
  return function(dispatch) {
    // set saving session state?

    axios
      .post('/api/sessions/save', sessions)
      .then(res => {
        const savedSessions = res.data.map(session => ({
          ...session,
          completionDate: new Date(session.completionDate),
          saved: true
        }));
        dispatch({
          type: SAVE_COMPLETED_SESSIONS,
          payload: savedSessions
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
}

export function updateSettings(settings) {
  return {
    type: UPDATE_SETTINGS,
    payload: settings
  };
}

export function toggleSettingsDisplay() {
  return {
    type: TOGGLE_SETTINGS_DISPLAY
  };
}