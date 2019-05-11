import {
  START_TIMER,
  UPDATE_TIME_LEFT,
  NEXT_TIMER,
  STOP_TIMER,
  RESET_CURRENT_TIMER,
  ADD_COMPLETED_TASK,
  CLEAR_COMPLETED_TASKS,
  UPDATE_COMPLETED_TASKS,
  UPDATE_SETTINGS,
  TOGGLE_TIMER_SETTINGS,
} from '../actions/types';

const task = 'Task';
const shortBreak = 'Break';
const longBreak = 'Long Break';

const initialState = {
  taskName: 'Work',
  shortBreakLength: 5 * 60,
  longBreakLength: 15 * 60,
  taskLength: 25 * 60,
  setLength: 4,
  goal: 12,
  alarmSound: 'https://res.cloudinary.com/carpol/video/upload/v1556684851/Pomodoro%20Clock/333629__jgreer__chime-sound_amp.mp3',
  tickSound: '',
  completedTasks: [],
  displaySettings: false,
  currentTimer: task,
  active: false,
  timeLeft: 25 * 60,
  startTime: null,
  timeLeftAtStart: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case START_TIMER: {
      if (state.active) break;
      return {
        ...state,
        startTime: Date.now(),
        timeLeftAtStart: state.timeLeft,
        active: true
      };
    }
    case STOP_TIMER: {
      return {
        ...state,
        active: false
      };
    }
    case UPDATE_TIME_LEFT: {
      const secondsElapsed = Math.round((Date.now() - state.startTime) / 1000);
      
      return {
        ...state,
        timeLeft: state.timeLeftAtStart - secondsElapsed
      };
    }
    case NEXT_TIMER: {
      let { completedTasks, timeLeft, currentTimer, setLength, shortBreakLength, longBreakLength, taskLength } = state;

      if (currentTimer === task) {
        if (
            completedTasks.length % setLength === 0
            && completedTasks.length !== 0
        ) {
          timeLeft = longBreakLength;
          currentTimer = longBreak;
        } else {
          timeLeft = shortBreakLength;
          currentTimer = shortBreak;
        }
      } else {
        timeLeft = taskLength;
        currentTimer = task;
      }

      return {
        ...state,
        timeLeft,
        currentTimer
      };
    }
    case RESET_CURRENT_TIMER: {
      let { timeLeft, currentTimer, taskLength, shortBreakLength, longBreakLength } = state;

      switch (currentTimer) {
        case task:
          timeLeft = taskLength;
          break;
        case shortBreak:
          timeLeft = shortBreakLength;
          break;
        case longBreak:
          timeLeft = longBreakLength;
          break;
      }

      return {
        ...state,
        timeLeft,
        timeLeftAtStart: timeLeft
      };
    }
    case ADD_COMPLETED_TASK: {
      let updatedTasks = [...state.completedTasks];
      
      updatedTasks.push(action.payload);

      return {
        ...state,
        completedTasks: updatedTasks
      };
    }
    case CLEAR_COMPLETED_TASKS: {
      return {
        ...state,
        completedTasks: []
      };
    }
    case UPDATE_COMPLETED_TASKS: {
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
    case TOGGLE_TIMER_SETTINGS: {
      return {
        ...state,
        displaySettings: !state.displaySettings
      };
    }
    default: 
      return state;
  }
}