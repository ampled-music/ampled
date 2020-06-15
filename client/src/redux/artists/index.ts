import { handleActions } from 'redux-actions';

import { getArtistReducer } from './get-details';
import { deleteArtistReducer } from './delete';
import { initialState } from './initial-state';

const combinedReducers = {
  ...getArtistReducer,
  ...deleteArtistReducer,
};

export const artists = handleActions(combinedReducers, initialState);
