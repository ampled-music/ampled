import { createActionThunk } from 'redux-thunk-actions';

import { getArtist } from '../../api/artist/get-artist';
import { actions } from './actions';

export const getArtistAction = createActionThunk(
  actions.getArtist,
  (slug: string) => getArtist(slug),
);

export const getArtistReducer = {
  [getArtistAction.STARTED]: (state) => ({
    ...state,
    loading: true,
  }),
  [getArtistAction.SUCCEEDED]: (state, { payload }) => ({
    ...state,
    artist: payload.artist,
  }),
  [getArtistAction.FAILED]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [getArtistAction.ENDED]: (state) => ({
    ...state,
    loading: false,
  }),
};
