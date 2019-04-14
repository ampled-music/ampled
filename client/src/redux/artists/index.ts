import { handleActions } from 'redux-actions';

import { getArtistReducer } from './get-details';
import { initialState } from './initial-state';

const combinedReducers = {
  ...getArtistReducer,
};

export const artists = handleActions(combinedReducers, initialState);
