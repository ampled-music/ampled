import { createActionThunk } from 'redux-thunk-actions';

import { signUp } from '../../api/sign-up/sign-up';
import { actions } from './actions';

export const signupAction = createActionThunk(
  actions.signup,
  (username: string, password: string, passwordConfirmation: string, name: string) =>
    signUp(username, password, passwordConfirmation, name),
);

export const signupReducer = {
  [signupAction.STARTED]: (state) => ({
    ...state,
    signingUp: true,
  }),
  [signupAction.SUCCEEDED]: (state, { payload }) => ({
    ...state,
    token: payload.token,
  }),
  [signupAction.FAILED]: (state, { payload }) => ({
    ...state,
    errors: payload.errors[0].detail,
  }),
  [signupAction.ENDED]: (state) => ({
    ...state,
    signingUp: false,
  }),
};
