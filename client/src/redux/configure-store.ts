import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { authentication } from './ducks/authenticate';
import { artist } from './ducks/get-artist';
import { pages } from './ducks/get-artists-pages';
import { me } from './ducks/get-me';

const ducks = combineReducers({
  authentication,
  artist,
  pages,
  me,
});

const configureStore = () => createStore(ducks, composeWithDevTools(applyMiddleware(thunk)));

export { configureStore };
