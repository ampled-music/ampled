import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { authentication } from './ducks/authenticate';
import { artist } from './ducks/get-artist';
import { pages } from './ducks/get-artists-pages';
import { me } from './ducks/get-me';
import { userLogin, userSignUp } from './ducks/login';

const ducks = combineReducers({
  authentication,
  artist,
  pages,
  me,
  userLogin,
  userSignUp,
});

const configureStore = () => createStore(ducks, composeWithDevTools(applyMiddleware(thunk)));

export { configureStore };
