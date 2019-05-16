import axios from 'axios';

import {
  UPDATE_ERRORS,
  START_TIMER,
  UPDATE_TIME_LEFT,
  NEXT_TIMER,
  STOP_TIMER,
  RESET_CURRENT_TIMER,
  ADD_COMPLETED_TASK,
  CLEAR_COMPLETED_TASKS,
  UPDATE_COMPLETED_TASKS,
  UPDATE_SETTINGS,
  TOGGLE_TIMER_SETTINGS,
  TIMER_LOADING
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

export function updatetimeLeft() {
  return {
    type: UPDATE_TIME_LEFT
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
    type: ADD_COMPLETED_TASK,
    payload: task
  };
}

export function clearCompletedTasks() {
  return {
    type: CLEAR_COMPLETED_TASKS
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
          type: UPDATE_COMPLETED_TASKS,
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

export function toggleTimerSettings() {
  return {
    type: TOGGLE_TIMER_SETTINGS
  };
}

export function updateErrors(errors) {
  return {
    type: UPDATE_ERRORS,
    payload: errors
  };
}

export function getTasks() {
  return function(dispatch) {
    dispatch({
      type: TIMER_LOADING
    });

    const now = new Date();
    const startDate = new Date(
      now.getFullYear(), 
      now.getMonth(), 
      now.getDate()
    );
  
    axios
      .get('/api/tasks/load', {
        params: {
          start: startDate
        }
      })
      .then(res => {
        const tasks = res.data.map(task => ({
          ...task,
          completedAt: new Date(task.completedAt),
          saved: true
        }));

        console.log('Today\'s tasks: ', tasks);

        dispatch({
          type: UPDATE_COMPLETED_TASKS,
          payload: tasks
        });
      })
      .catch(err => console.log(err));
  }
}