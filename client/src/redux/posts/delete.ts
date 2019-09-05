import { createActionThunk } from 'redux-thunk-actions';

import { deletePost } from '../../api/post/delete-post';
import { actions } from './actions';

export const deletePostAction = createActionThunk(actions.deletePost, (id: number) => deletePost(id));

export const deletePostReducer = {
  [deletePostAction.STARTED]: (state) => ({
    ...state,
    deletingPost: true,
  }),
  [deletePostAction.SUCCEEDED]: (state) => ({
    ...state,
    postDeleted: true,
  }),
  [deletePostAction.FAILED]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [deletePostAction.ENDED]: (state) => ({
    ...state,
    postDeleted: false,
    deletingPost: false,
  }),
};
