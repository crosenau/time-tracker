import {
  CHART_LOADING,
  UPDATE_CHART_TASKS,
  UPDATE_CHART_SETTINGS,
  TOGGLE_CHART_SETTINGS
} from "../actions/types";

const now = new Date();

now.setHours(23);
now.setMinutes(59);
now.setSeconds(59);
now.setMilliseconds(999);

const lastMonth = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() -30,
  0,
  0,
  0, 
  0
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
    case CHART_LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    case UPDATE_CHART_TASKS: {
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