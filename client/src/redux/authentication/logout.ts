import { createActionThunk } from 'redux-thunk-actions';
import * as Sentry from '@sentry/browser';
import { logout } from '../../api/login/logout';
import { actions } from './actions';

export const logoutAction = createActionThunk(actions.logout, () => {
  logout();
  Sentry.configureScope((scope) => scope.setUser(null));
});

export const logoutReducer = {
  [logoutAction.STARTED]: (state) => ({
    ...state,
    loggingOut: true,
  }),
  [logoutAction.SUCCEEDED]: (state) => ({
    ...state,
    loggedOut: true,
  }),
  [logoutAction.FAILED]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [logoutAction.ENDED]: (state) => ({
    ...state,
    loggingOut: false,
  }),
};
