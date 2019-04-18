import { createAction } from 'redux-actions';

import { actions } from './actions';
import { Reducer } from './initial-state';

export const saveNavigationStateAction = createAction(actions.saveNavigationState);

export const saveNavigationStateReducer = {
  [actions.saveNavigationState]: (state, { payload }) => ({
    ...state,
    location: payload,
  }),
} as Reducer;
