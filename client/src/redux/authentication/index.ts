import { handleActions } from 'redux-actions';

import { initialState } from './initial-state';
import { loginReducer } from './login';

const combinedReducers = {
  ...loginReducer,
};

export const authentication = handleActions(combinedReducers, initialState);
