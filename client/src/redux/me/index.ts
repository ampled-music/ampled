import { handleActions } from 'redux-actions';

import { getMeReducer } from './get-me';
import { initialState } from './initial-state';
import { setUserDataReducer } from './set-me';
import { updateMeReducer } from './update-me';

export const combinedReducers = {
  ...getMeReducer,
  ...updateMeReducer,
  ...setUserDataReducer,
};

export const me = handleActions(combinedReducers, initialState);
