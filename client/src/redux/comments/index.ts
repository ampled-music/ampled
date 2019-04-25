import { handleActions } from 'redux-actions';

import { createCommentReducer } from './create';
import { deleteCommentReducer } from './delete';
import { initialState } from './initial-state';

const combinedReducers = {
  ...createCommentReducer,
  ...deleteCommentReducer,
};

export const comments = handleActions(combinedReducers, initialState);
