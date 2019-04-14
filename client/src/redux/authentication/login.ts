import { createActionThunk } from 'redux-thunk-actions';

import { login } from '../../api/login/login';
import { actions } from './actions';

export const loginAction = createActionThunk(actions.login, (username: string, password: string) =>
  login(username, password),
);

export const loginReducer = {
  [loginAction.STARTED]: (state) => ({
    ...state,
    authenticating: true,
  }),
  [loginAction.SUCCEEDED]: (state, { payload }) => ({
    ...state,
    token: payload.token,
  }),
  [loginAction.FAILED]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [loginAction.ENDED]: (state) => ({
    ...state,
    authenticating: false,
  }),
};
