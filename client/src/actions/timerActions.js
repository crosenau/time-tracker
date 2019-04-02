import {
  START_TIMER,
  UPDATE_TIME_REMAINING,
  NEXT_TIMER,
  STOP_TIMER,
  ADD_COMPLETED_SESSION,
  UPDATE_SETTINGS,
  RESET_CURRENT_TIMER,
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