import { combineReducers } from 'redux';

import { USER_LOGOUT } from '../actions/types';

import authReducer from './authReducer';
import errorReducer from './errorReducer';
import chartReducer from './chartReducer';
import timerReducer from './timerReducer';

const appReducer = combineReducers({
  auth: authReducer,
  errors: errorReducer,
  chart: chartReducer,
  timer: timerReducer
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;