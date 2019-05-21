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
  UPDATE_TIMER_SETTINGS,
  TOGGLE_TIMER_SETTINGS,
  TIMER_SYNCING,
  TIMER_SYNCED,
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
  return async function(dispatch) {
    // set saving task state?
    dispatch({
      type: TIMER_SYNCING
    });

    try {
      const response = await axios.post('/api/tasks/save', tasks)
      const savedTasks = response.data.map(task => ({
        ...task,
        completedAt: new Date(task.completedAt),
        saved: true
      }));

      dispatch({
        type: UPDATE_COMPLETED_TASKS,
        payload: savedTasks
      });
    } catch (err) {
        console.error(err);
    } finally {
      dispatch({
        type: TIMER_SYNCED
      });
    }
  }
}

export function saveSettings(settings) {
  return async function(dispatch) {
    dispatch({
      type: TIMER_SYNCING
    });

    try {
      await axios.post('api/timers/save', settings);
    } catch(err) {
      console.log(err.response);
    } finally {
      dispatch({
        type: UPDATE_TIMER_SETTINGS,
        payload: settings
      });

      dispatch({
        type: TIMER_SYNCED
      });
    }
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
  return async function(dispatch) {
    dispatch({
      type: TIMER_SYNCING
    });

    const now = new Date();
    const startDate = new Date(
      now.getFullYear(), 
      now.getMonth(), 
      now.getDate()
    );
  
    try {
      const response = await axios
        .get('/api/tasks/load', {
          params: {
            start: startDate
          }
        });

      const tasks = response.data.map(task => ({
        ...task,
        completedAt: new Date(task.completedAt),
        saved: true
      }));

      dispatch({
        type: UPDATE_COMPLETED_TASKS,
        payload: tasks
      });
    } catch(err) {
      console.log(err);
    } finally {
      dispatch({
        type: TIMER_SYNCED
      });
    }
  }
}

export function getTimer() {
  return async function(dispatch) {
    dispatch({
      type: TIMER_SYNCING
    });

    try {
      const response = await axios.get('/api/timers/load');
      console.log(response);

      dispatch({
        type: UPDATE_TIMER_SETTINGS,
        payload: response.data
      });
    } catch(err) {
      console.log(err.response.request.response);
    } finally {
      dispatch({
        type: TIMER_SYNCED,
      });
    }
  }
}