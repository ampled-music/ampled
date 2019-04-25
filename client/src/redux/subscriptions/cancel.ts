import { createActionThunk } from 'redux-thunk-actions';

import { cancelSubscription } from '../../api/artist/cancel-subscription';
import { actions } from './actions';
import { initialState } from './initial-state';

export const cancelSubscriptionAction = createActionThunk(
  actions.cancelSubscription,
  (subscription: { artistPageId: number }) => cancelSubscription(subscription),
);

export const cancelSubscriptionReducer = {
  [cancelSubscriptionAction.STARTED]: (state: typeof initialState) => ({
    ...state,
    processing: true,
  }),
  [cancelSubscriptionAction.SUCCEEDED]: (state: typeof initialState) => ({
    ...state,
    cancelled: true,
  }),
  [cancelSubscriptionAction.FAILED]: (state: typeof initialState, { payload }) => ({
    ...state,
    error: payload,
  }),
  [cancelSubscriptionAction.ENDED]: (state: typeof initialState) => ({
    ...state,
    processing: initialState.processing,
    cancelled: initialState.cancelled,
  }),
};
