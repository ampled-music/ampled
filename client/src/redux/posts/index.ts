import { handleActions } from 'redux-actions';

import { createPostReducer } from './create';
import { initialState } from './initial-state';

const combinedReducers = {
  ...createPostReducer,
};

export const posts = handleActions(combinedReducers, initialState);
