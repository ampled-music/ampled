import { handleActions } from 'redux-actions';
import { createActionThunk } from 'redux-thunk-actions';

import { login } from '../../api/login/login';
import { signUp } from '../../api/sign-up/sign-up';

export const initialState = {
  token: {},
  loading: false,
  error: null,
};

export const userLoginAction = createActionThunk('LOGIN', (username: string, password: string) =>
  login(username, password),
);

export const userSignUpAction = createActionThunk(
  'SIGN_UP',
  (username: string, password: string, passwordconfirmation: string, name: string) =>
    signUp(username, password, passwordconfirmation, name),
);

export const userLogin = handleActions(
  {
    [userLoginAction.START]: (state) => ({
      ...state,
      loading: true,
    }),
    [userLoginAction.SUCCEEDED]: (state, action) => ({
      ...state,
      token: action.payload.token,
    }),
    [userLoginAction.FAILED]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload.error,
    }),
    [userLoginAction.ENDED]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialState,
);

export const userSignUp = handleActions(
  {
    [userSignUpAction.START]: (state) => ({
      ...state,
      loading: true,
    }),
    [userSignUpAction.SUCCEEDED]: (state, action) => ({
      ...state,
      token: action.payload.token,
    }),
    [userSignUpAction.FAILED]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload.error,
    }),
    [userSignUpAction.ENDED]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialState,
);
