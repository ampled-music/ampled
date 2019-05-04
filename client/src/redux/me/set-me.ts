import { createAction } from 'redux-actions';

import { actions } from './actions';
import { Reducer } from './initial-state';

export const setUserDataAction = createAction(actions.setUserData);

export const setUserDataReducer = {
  [actions.setUserData]: (state, { payload }) => {
    return {
      ...state,
      userData: {
        ...state.userData,
        ...payload,
      },
    };
  },
} as Reducer;
