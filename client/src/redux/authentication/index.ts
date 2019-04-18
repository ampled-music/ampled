import { handleActions } from 'redux-actions';

import { authModalReducer } from './authentication-modal';
import { initialState } from './initial-state';
import { loginReducer } from './login';
import { logoutReducer } from './logout';

const combinedReducers = {
  ...authModalReducer,
  ...loginReducer,
  ...logoutReducer,
};

export const authentication = handleActions(combinedReducers, initialState);
