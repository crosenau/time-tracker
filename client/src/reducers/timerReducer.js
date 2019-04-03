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

const session = 'session';
const shortBreak = 'Break';
const longBreak = 'Long Break';

const initialState = {
  task: 'Work',
  shortBreakLength: 1,
  longBreakLength: 2,
  sessionLength: 3,
  setLength: 4,
  goal: 12,
  alarmSound: 'https://res.cloudinary.com/carpol/video/upload/v1542177884/Pomodoro%20Clock/78506__joedeshon__desk-bell-one-time-01.mp3',
  tickSound: null, // url
  completedSessions: [],
  displaySettings: false,
  currentTimer: session,
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
      let { completedSessions, timeRemaining, currentTimer, setLength, shortBreakLength, longBreakLength, sessionLength } = state;

      if (currentTimer === session) {
        if (completedSessions.length % setLength === 0) {
          timeRemaining = longBreakLength;
          currentTimer = longBreak;
        } else {
          timeRemaining = shortBreakLength;
          currentTimer = shortBreak;
        }
      } else {
        timeRemaining = sessionLength;
        currentTimer = session;
      }

      return {
        ...state,
        timeRemaining,
        currentTimer
      };
    }
    case RESET_CURRENT_TIMER: {
      let { timeRemaining, currentTimer, sessionLength, shortBreakLength, longBreakLength } = state;

      switch (currentTimer) {
        case session:
          timeRemaining = sessionLength;
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
      let updatedSessions = [...state.completedSessions];
      
      updatedSessions.push(action.payload);

      return {
        ...state,
        completedSessions: updatedSessions
      };
    }
    case CLEAR_COMPLETED_SESSIONS: {
      return {
        ...state,
        completedSessions: []
      };
    }
    case SAVE_COMPLETED_SESSIONS: {





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