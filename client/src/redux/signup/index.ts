import { handleActions } from 'redux-actions';

import { initialState } from './initial-state';
import { signupReducer } from './signup';

const combinedReducers = {
  ...signupReducer,
};

export const signup = handleActions(combinedReducers, initialState);
