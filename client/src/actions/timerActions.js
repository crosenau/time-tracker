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

export function addCompletedTask(task) {
  return {
    type: ADD_COMPLETED_SESSION,
    payload: task
  };
}

export function clearCompletedTasks() {
  return {
    type: CLEAR_COMPLETED_SESSIONS
  };
}

export function saveCompletedTasks(tasks) {
  return function(dispatch) {
    // set saving task state?

    axios
      .post('/api/tasks/save', tasks)
      .then(res => {
        const savedTasks = res.data.map(task => ({
          ...task,
          completedAt: new Date(task.completedAt),
          saved: true
        }));
        dispatch({
          type: SAVE_COMPLETED_SESSIONS,
          payload: savedTasks
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