import { handleActions } from 'redux-actions';
import { createActionThunk } from 'redux-thunk-actions';

import { getArtistsPages } from '../../api/artist/get-artists-pages';

export const initialState = {
  pages: {},
  loading: true,
  error: null,
};

export const artistsPages = createActionThunk('GET_ARTISTS_PAGES', () => getArtistsPages());

export const pages = handleActions(
  {
    [artistsPages.START]: (state) => ({
      ...state,
      loading: true,
    }),
    [artistsPages.SUCCEEDED]: (state, action) => ({
      ...state,
      pages: action.payload.pages,
    }),
    [artistsPages.FAILED]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload.error,
    }),
    [artistsPages.ENDED]: (state) => ({
      ...state,
      loading: false,
    }),
  },
  initialState,
);
