import { handleActions } from 'redux-actions';
import { createActionThunk } from 'redux-thunk-actions';

import { login } from '../../api/login/login';

export const initialState = {
  token: {},
  loading: false,
  error: null,
};

export const userLogin = createActionThunk('LOGIN', (username, password) => login(username, password));

export const loginReducer = handleActions(
  {
    [userLogin.START]: (state) => ({
      ...state,
      loading: true,
    }),
    [userLogin.SUCCEEDED]: (state, action) => ({
      ...state,
      token: action.payload.token,
    }),
    [userLogin.FAILED]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload.error,
    }),
    [userLogin.ENDED]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialState,
);
