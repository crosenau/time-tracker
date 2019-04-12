import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import chartReducer from './chartReducer';
import timerReducer from './timerReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  chart: chartReducer,
  timer: timerReducer
});