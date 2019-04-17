import { handleActions } from 'redux-actions';

import { initialState } from './initial-state';
import { loginReducer } from './login';
import { logoutReducer } from './logout';

const combinedReducers = {
  ...loginReducer,
  ...logoutReducer,
};

export const authentication = handleActions(combinedReducers, initialState);
