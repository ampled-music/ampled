import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { artists } from './artists';
import { initialState as artistsInitialState } from './artists/initial-state';
import { authentication } from './authentication';
import { initialState as authenticationInitialState } from './authentication/initial-state';
import { comments } from './comments';
import { initialState as commentsInitialState } from './comments/initial-state';
import { pages } from './ducks/get-artists-pages';
import { me } from './ducks/get-me';
import { posts } from './posts';
import { initialState as postsInitialState } from './posts/initial-state';
import { signup } from './signup';
import { initialState as signupInitialState } from './signup/initial-state';

export interface Store {
  posts: typeof postsInitialState;
  artists: typeof artistsInitialState;
  authentication: typeof authenticationInitialState;
  comments: typeof commentsInitialState;
  signup: typeof signupInitialState;
}

const ducks = combineReducers({
  authentication,
  artists,
  pages,
  me,
  posts,
  comments,
  signup,
});

const configureStore = () => createStore(ducks, composeWithDevTools(applyMiddleware(thunk)));

export { configureStore };
