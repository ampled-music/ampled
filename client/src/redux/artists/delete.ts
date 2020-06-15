import { createActionThunk } from 'redux-thunk-actions';

import { deleteArtist } from '../../api/artist/delete-artist';
import { actions } from './actions';

export const deleteArtistAction = createActionThunk(
  actions.deleteArtist,
  (id: number) => deleteArtist(id),
);

export const deleteArtistReducer = {
  [deleteArtistAction.STARTED]: (state) => ({
    ...state,
    deletingArtist: true,
  }),
  [deleteArtistAction.SUCCEEDED]: (state) => ({
    ...state,
    artistDeleted: true,
  }),
  [deleteArtistAction.FAILED]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [deleteArtistAction.ENDED]: (state) => ({
    ...state,
    artistDeleted: false,
    deletingArtist: false,
  }),
};
