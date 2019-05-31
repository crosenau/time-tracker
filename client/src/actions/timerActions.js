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

export const startTimer = () => ({
  type: START_TIMER
});

export const stopTimer = () => ({
  type: STOP_TIMER
});

export const updateTimeLeft = ms => ({
  type: UPDATE_TIME_LEFT,
  payload: ms
});

export const nextTimer = () => ({
  type: NEXT_TIMER
});

export const resetCurrentTimer = () => ({
  type: RESET_CURRENT_TIMER
});

export const addCompletedTask = task => ({
  type: ADD_COMPLETED_TASK,
  payload: task
});

export const clearCompletedTasks = () => ({
  type: CLEAR_COMPLETED_TASKS
});

export const saveCompletedTasks = tasks => async dispatch => {
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
};

export const saveSettings = settings => async dispatch => {
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

export const toggleTimerSettings = () => ({
  type: TOGGLE_TIMER_SETTINGS
});

export const updateErrors = errors => ({
  type: UPDATE_ERRORS,
  payload: errors
});

export const getTasks = () => async dispatch => {
  dispatch({
    type: TIMER_SYNCING
  });

  const now = new Date();
  const startDate = new Date(
    now.getFullYear(), 
    now.getMonth(), 
    now.getDate()
  );
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    999
  );

  try {
    const response = await axios
      .get('/api/tasks/load', {
        params: {
          start: startDate,
          end: endDate
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
};

export const getTimer = () => async dispatch => {
  dispatch({
    type: TIMER_SYNCING
  });

  try {
    const response = await axios.get('/api/timers/load');

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
};