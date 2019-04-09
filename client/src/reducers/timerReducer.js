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
  TOGGLE_SETTINGS_DISPLAY,
} from '../actions/types';

const task = 'task';
const shortBreak = 'Break';
const longBreak = 'Long Break';

const initialState = {
  taskName: 'Work',
  shortBreakLength: 1,
  longBreakLength: 2,
  taskLength: 3,
  setLength: 4,
  goal: 12,
  alarmSound: 'https://res.cloudinary.com/carpol/video/upload/v1542177884/Pomodoro%20Clock/78506__joedeshon__desk-bell-one-time-01.mp3',
  tickSound: null, // url
  completedTasks: [],
  displaySettings: false,
  currentTimer: task,
  active: false,
  timeRemaining: 3,
  startTime: null,
  timeRemainingAtStart: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case START_TIMER: {
      if (state.active) break;
      return {
        ...state,
        startTime: Date.now(),
        timeRemainingAtStart: state.timeRemaining,
        active: true
      };
    }
    case STOP_TIMER: {
      return {
        ...state,
        active: false
      };
    }
    case UPDATE_TIME_REMAINING: {
      const secondsElapsed = Math.round((Date.now() - state.startTime) / 1000);
      
      return {
        ...state,
        timeRemaining: state.timeRemainingAtStart - secondsElapsed
      };
    }
    case NEXT_TIMER: {
      let { completedTasks, timeRemaining, currentTimer, setLength, shortBreakLength, longBreakLength, taskLength } = state;

      if (currentTimer === task) {
        if (
            completedTasks.length % setLength === 0
            && completedTasks.length !== 0
        ) {
          timeRemaining = longBreakLength;
          currentTimer = longBreak;
        } else {
          timeRemaining = shortBreakLength;
          currentTimer = shortBreak;
        }
      } else {
        timeRemaining = taskLength;
        currentTimer = task;
      }

      return {
        ...state,
        timeRemaining,
        currentTimer
      };
    }
    case RESET_CURRENT_TIMER: {
      let { timeRemaining, currentTimer, taskLength, shortBreakLength, longBreakLength } = state;

      switch (currentTimer) {
        case task:
          timeRemaining = taskLength;
          break;
        case shortBreak:
          timeRemaining = shortBreakLength;
          break;
        case longBreak:
          timeRemaining = longBreakLength;
          break;
      }

      return {
        ...state,
        timeRemaining,
        timeRemainingAtStart: timeRemaining
      };
    }
    case ADD_COMPLETED_SESSION: {
      let updatedTasks = [...state.completedTasks];
      
      updatedTasks.push(action.payload);

      return {
        ...state,
        completedTasks: updatedTasks
      };
    }
    case CLEAR_COMPLETED_SESSIONS: {
      return {
        ...state,
        completedTasks: []
      };
    }
    case SAVE_COMPLETED_SESSIONS: {
      const updatedTasks = [...action.payload];
      const savedDates = updatedTasks.map(task => Number(task.completedAt));

      for (let task of state.completedTasks) {
        if (!savedDates.includes(Number(task.completedAt))) {
          updatedTasks.push(task);
        }
      }

      return {
        ...state,
        completedTasks: updatedTasks
      };
    }
    case UPDATE_SETTINGS: {
      return {
        ...state,
        ...action.payload
      };
    }
    case TOGGLE_SETTINGS_DISPLAY: {
      return {
        ...state,
        displaySettings: !state.displaySettings
      };
    }
    default: 
      return state;
  }
}