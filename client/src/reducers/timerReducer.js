import {
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
  TIMER_SYNCED
} from '../actions/types';

import toMilliseconds from '@sindresorhus/to-milliseconds';

import alarmSounds from '../components/settings/alarmSounds';

const task = 'Task';
const shortBreak = 'Break';
const longBreak = 'Long Break';

const initialState = {
  taskName: 'Work',
  shortBreakLength: toMilliseconds({ minutes: 5 }),
  longBreakLength: toMilliseconds({ minutes: 15}),
  taskLength: toMilliseconds({ minutes: 25 }),
  setLength: 4,
  goal: 12,
  alarmSound: alarmSounds[0].url,
  tickSound: null,
  completedTasks: [],
  displaySettings: false,
  currentTimer: task,
  active: false,
  timeLeft: toMilliseconds({ minutes: 25 }),
  startTime: null,
  timeLeftAtStart: null,  
  syncing: 0
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
      const elapsed = Date.now() - state.startTime;
      
      return {
        ...state,
        timeLeft: state.timeLeftAtStart - elapsed
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
        case task: {
          timeLeft = taskLength;
          break;
        }
        case shortBreak: {
          timeLeft = shortBreakLength;
          break;
        }
        case longBreak: {
          timeLeft = longBreakLength;
          break;
        }
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
        completedTasks: updatedTasks,
      };
    }
    case UPDATE_TIMER_SETTINGS: {
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
    case TIMER_SYNCING: {
      return {
        ...state,
        syncing: state.syncing + 1
      };
    }
    case TIMER_SYNCED: {
      return {
        ...state,
        syncing: state.syncing - 1
      };
    }
    default: 
      return state;
  }
}