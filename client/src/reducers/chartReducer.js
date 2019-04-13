import {
  LOAD_TASKS,
  UPDATE_CHART_SETTINGS,
  TOGGLE_CHART_SETTINGS
} from "../actions/types";

const now = new Date();
const lastWeek = new Date(
  now.getFullYear(), 
  now.getMonth(), 
  now.getDate() - 7, 
  now.getHours(), 
  now.getMinutes(), 
  now.getSeconds(), 
  now.getMilliseconds()
);

const initialState = {
  tasks: [],
  filter: [],
  startDate: lastWeek,
  endDate: now,
  displaySettings: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_TASKS: {
      return {
        ...state,
        tasks: action.payload
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