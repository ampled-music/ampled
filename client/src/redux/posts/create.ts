import { createActionThunk } from 'redux-thunk-actions';

import { createPost } from '../../api/post/create-post';
import { actions } from './actions';

export const createPostAction = createActionThunk(actions.createPost, (post) => createPost(post));

export const createPostReducer = {
  [createPostAction.STARTED]: (state) => ({
    ...state,
    creatingPost: true,
  }),
  [createPostAction.SUCCEEDED]: (state) => ({
    ...state,
    postCreated: true,
  }),
  [createPostAction.FAILED]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [createPostAction.ENDED]: (state) => ({
    ...state,
    postCreated: false,
    creatingPost: false,
  }),
};
