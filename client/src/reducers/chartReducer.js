import {
  TASKS_LOADING,
  UPDATE_TASKS,
  UPDATE_CHART_SETTINGS,
  TOGGLE_CHART_SETTINGS
} from "../actions/types";

const now = new Date();
const lastMonth = new Date(
  now.getFullYear(), 
  now.getMonth(), 
  now.getDate() -30, 
  now.getHours(), 
  now.getMinutes(), 
  now.getSeconds(), 
  now.getMilliseconds()
);

const initialState = {
  tasks: [],
  filter: [],
  startDate: lastMonth,
  endDate: now,
  displaySettings: false,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TASKS_LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    case UPDATE_TASKS: {
      return {
        ...state,
        tasks: action.payload,
        loading: false
      };
    }
    case UPDATE_CHART_SETTINGS: {
      const { startDate, endDate, filter } = action.payload;
      return {
        ...state,
        startDate,
        endDate,
        filter
      };
    }

    case TOGGLE_CHART_SETTINGS: {
      return {
        ...state,
        displaySettings: !state.displaySettings
      };
    }

    default:
      return state;
  }
}