import { handleActions } from 'redux-actions';

import { getArtistReducer } from './get-details';
import { deleteArtistReducer } from './delete';
import { restoreArtistReducer } from './restore';

import { initialState } from './initial-state';

const combinedReducers = {
  ...getArtistReducer,
  ...deleteArtistReducer,
  ...restoreArtistReducer,
};

export const artists = handleActions(combinedReducers, initialState);
