import { handleActions } from 'redux-actions';

import { getMeReducer } from './get-me';
import { initialState } from './initial-state';
import { updateMeReducer } from './update-me';

export const combinedReducers = {
  ...getMeReducer,
  ...updateMeReducer,
};

export const me = handleActions(combinedReducers, initialState);
