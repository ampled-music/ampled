import { createActionThunk } from 'redux-thunk-actions';

import { restoreArtist } from '../../api/artist/restore-artist';
import { actions } from './actions';

export const restoreArtistAction = createActionThunk(
  actions.restoreArtist,
  (id: number) => restoreArtist(id),
);

export const restoreArtistReducer = {
  [restoreArtistAction.STARTED]: (state) => ({
    ...state,
    restoringArtist: true,
  }),
  [restoreArtistAction.SUCCEEDED]: (state) => ({
    ...state,
    artistRestored: true,
  }),
  [restoreArtistAction.FAILED]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [restoreArtistAction.ENDED]: (state) => ({
    ...state,
    artistDeleted: false,
    restoringArtist: false,
  }),
};
