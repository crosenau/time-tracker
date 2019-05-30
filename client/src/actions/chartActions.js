import axios from 'axios';

import {
  UPDATE_ERRORS,
  CHART_LOADING,
  UPDATE_CHART_TASKS,
  UPDATE_CHART_SETTINGS,
  TOGGLE_CHART_SETTINGS
} from './types';

export const getTasks = data => async dispatch => {
  dispatch({
    type: CHART_LOADING
  });

  try {
    const response = await axios.get('/api/tasks/load', {
      params: {
        start: data.startDate,
        end: data.endDate
      } 
    });
    const tasks = response.data.map(task => ({
      ...task,
      completedAt: new Date(task.completedAt)
    }))

    dispatch({
      type: UPDATE_CHART_TASKS,
      payload: tasks
    });
  } catch (err) {
    console.log(err);
  };
};

export const updateChartSettings = settings => ({
  type: UPDATE_CHART_SETTINGS,
  payload: settings
});

export const toggleChartSettings = () => ({
  type: TOGGLE_CHART_SETTINGS
});

export const updateErrors = errors => ({
  type: UPDATE_ERRORS,
  payload: errors
});