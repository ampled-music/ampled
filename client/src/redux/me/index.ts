import { handleActions } from 'redux-actions';

import { getMeReducer } from './get-me';
import { initialState } from './initial-state';

export const combinedReducers = {
  ...getMeReducer,
};

export const me = handleActions(combinedReducers, initialState);
