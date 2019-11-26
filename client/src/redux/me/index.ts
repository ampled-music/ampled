import { handleActions } from 'redux-actions';

import { getMeReducer } from './get-me';
import { initialState } from './initial-state';
import { setUserDataReducer } from './set-me';
import { updateMeReducer } from './update-me';
import { updateCardReducer } from './update-card';

export const combinedReducers = {
  ...getMeReducer,
  ...updateMeReducer,
  ...setUserDataReducer,
  ...updateCardReducer,
};

export const me = handleActions(combinedReducers, initialState);
