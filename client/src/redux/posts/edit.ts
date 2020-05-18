import { createActionThunk } from 'redux-thunk-actions';

import { editPost } from '../../api/post/edit-post';
import { actions } from './actions';

export const editPostAction = createActionThunk(actions.createPost, (post) =>
  editPost(post),
);

export const editPostReducer = {
  [editPostAction.STARTED]: (state) => ({
    ...state,
    creatingPost: true,
  }),
  [editPostAction.SUCCEEDED]: (state) => ({
    ...state,
    postCreated: true,
  }),
  [editPostAction.FAILED]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [editPostAction.ENDED]: (state) => ({
    ...state,
    postCreated: false,
    creatingPost: false,
  }),
};
