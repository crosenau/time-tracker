import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import {
  UPDATE_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  USER_LOGOUT
} from './types';

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err => {
      const errors = typeof err.response.data !== 'object' ? { http: err.response.data } : err.response.data;

      dispatch({
        type: UPDATE_ERRORS,
        payload: errors
      })
    });
};

export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      const { token } = res.data;
      
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => dispatch({
      type: UPDATE_ERRORS,
      payload: err.response.data
    }));
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  dispatch({ type: USER_LOGOUT })
};

export const clearErrors = () => {
  return {
    type: UPDATE_ERRORS,
    payload: {}
  };
}