import { handleActions } from 'redux-actions';
import { createActionThunk } from 'redux-thunk-actions';

import { getArtist } from '../../api/artist/get-artist';

export const initialState = {
  artist: {},
  loading: true,
  error: null,
};

export const getArtistData = createActionThunk('GET_ARTIST', (artistId) => getArtist(artistId));

export const artist = handleActions(
  {
    [getArtistData.START]: (state) => ({
      ...state,
      loading: true,
    }),
    [getArtistData.SUCCEEDED]: (state, action) => ({
      ...state,
      artist: action.payload.artist,
    }),
    [getArtistData.FAILED]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload.error,
    }),
    [getArtistData.ENDED]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialState,
);
