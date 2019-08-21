import { handleActions } from 'redux-actions';

import { createPostReducer } from './create';
import { deletePostReducer } from './delete';
import { initialState } from './initial-state';

const combinedReducers = {
  ...createPostReducer,
  ...deletePostReducer,
};

export const posts = handleActions(combinedReducers, initialState);
