import { createActionThunk } from 'redux-thunk-actions';

import { deleteComment } from '../../api/post/delete-comment';
import { actions } from './actions';

export const deleteCommentAction = createActionThunk(actions.deleteComment, (id: number) => deleteComment(id));

export const deleteCommentReducer = {
  [deleteCommentAction.STARTED]: (state) => ({
    ...state,
    deletingPost: true,
  }),
  [deleteCommentAction.SUCCEEDED]: (state) => ({
    ...state,
    commentDeleted: true,
  }),
  [deleteCommentAction.FAILED]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [deleteCommentAction.ENDED]: (state) => ({
    ...state,
    commentDeleted: false,
    deletingPost: false,
  }),
};
