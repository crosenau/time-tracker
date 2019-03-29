import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import timerReducer from './timerReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  timer: timerReducer
});