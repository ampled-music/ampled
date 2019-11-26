import { createActionThunk } from 'redux-thunk-actions';
import { updateCard } from 'src/api/me/update-card';

import { actions } from './actions';
import { Reducer } from './initial-state';

export const updateCardAction = createActionThunk(actions.updateCard, async (token) => {
  return updateCard(token);
});

export const updateCardReducer = {
  [updateCardAction.STARTED]: (state) => ({
    ...state,
    updatingCard: true,
  }),
  [updateCardAction.SUCCEEDED]: (state, { payload }) => ({
    ...state,
    updatedCard: true,
    userData: {
      ...state.userData,
      ...payload,
    },
  }),
  [updateCardAction.FAILED]: (state, { payload }) => ({
    ...state,
    updatingCard: false,
    errorCard: payload,
  }),
  [updateCardAction.ENDED]: (state) => ({
    ...state,
    updatingCard: false,
  }),
} as Reducer;
