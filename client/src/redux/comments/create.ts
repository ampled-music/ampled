import { createActionThunk } from 'redux-thunk-actions';

import { addComment } from '../../api/post/add-comment';
import { actions } from './actions';

export const createCommentAction = createActionThunk(actions.createComment, (comment) => addComment(comment));

export const createCommentReducer = {
  [createCommentAction.STARTED]: (state) => ({
    ...state,
    creatingComment: true,
  }),
  [createCommentAction.SUCCEEDED]: (state) => ({
    ...state,
    commentCreated: true,
  }),
  [createCommentAction.FAILED]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [createCommentAction.ENDED]: (state) => ({
    ...state,
    commentCreated: false,
    creatingComment: false,
  }),
};
