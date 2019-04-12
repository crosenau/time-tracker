import axios from 'axios';

import {
  LOAD_TASKS,
  UPDATE_CHART_SETTINGS,
  TOGGLE_CHART_SETTINGS
} from './types';

export function getTasks() {
  return function(dispatch) {
    // Set loading state

    axios
      .post('/api/tasks/load')
      .then(res => {
        const tasks = res.data.map(task => ({
          ...task,
          completedAt: new Date(task.completedAt)
        }))

        dispatch({
          type: LOAD_TASKS,
          payload: tasks
        });
      })
      .catch(err => {
        console.log(err);
      })
  }
}

export function updatechartSettings(settings) {
  return {
    type: UPDATE_CHART_SETTINGS,
    payload: settings
  };
} 

export function togglechartSettings() {
  return {
    type: TOGGLE_CHART_SETTINGS
  };
}