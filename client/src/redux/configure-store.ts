import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { artists } from './artists';
import { initialState as artistsInitialState } from './artists/initial-state';
import { comments } from './comments';
import { initialState as commentsInitialState } from './comments/initial-state';
import { authentication } from './ducks/authenticate';
import { initialState as authenticateInitialState } from './ducks/authenticate-initial-state';
import { pages } from './ducks/get-artists-pages';
import { me } from './ducks/get-me';
import { userLogin, userSignUp } from './ducks/login';
import { posts } from './posts';
import { initialState as postsInitialState } from './posts/initial-state';

export interface Store {
  posts: typeof postsInitialState;
  artists: typeof artistsInitialState;
  authentication: typeof authenticateInitialState;
  comments: typeof commentsInitialState;
}

const ducks = combineReducers({
  authentication,
  artists,
  pages,
  me,
  userLogin,
  userSignUp,
  posts,
  comments,
});

const configureStore = () => createStore(ducks, composeWithDevTools(applyMiddleware(thunk)));

export { configureStore };
