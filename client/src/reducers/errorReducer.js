import { UPDATE_ERRORS } from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ERRORS:
      return action.payload;
    default:
      return state;
  }
}