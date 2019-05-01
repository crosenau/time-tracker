import axios from 'axios';

import {
  UPDATE_ERRORS,
  TASKS_LOADING,
  UPDATE_TASKS,
  UPDATE_CHART_SETTINGS,
  TOGGLE_CHART_SETTINGS
} from './types';

export function getTasks(data) {
  return function(dispatch) {
    // Set loading state
    dispatch({
      type: TASKS_LOADING
    });

    axios
      .get('/api/tasks/load', {
        params: {
          start: data.startDate,
          end: data.endDate
        } 
      })
      .then(res => {
        const tasks = res.data.map(task => ({
          ...task,
          completedAt: new Date(task.completedAt)
        }))

        dispatch({
          type: UPDATE_TASKS,
          payload: tasks
        });
      })
      .catch(err => {
        console.log(err);
      })
  }
}

export function updateChartSettings(settings) {
  return {
    type: UPDATE_CHART_SETTINGS,
    payload: settings
  };
} 

export function toggleChartSettings() {
  return {
    type: TOGGLE_CHART_SETTINGS
  };
}

export function updateErrors(errors) {
  return {
    type: UPDATE_ERRORS,
    payload: errors
  };
}