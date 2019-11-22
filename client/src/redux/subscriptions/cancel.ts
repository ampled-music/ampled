import { createActionThunk } from 'redux-thunk-actions';

import { cancelSubscription } from '../../api/artist/cancel-subscription';
import { actions } from './actions';
import { initialState } from './initial-state';

export const cancelSubscriptionAction = createActionThunk(
  actions.cancelSubscription,
  (subscription: { artistPageId: number; subscriptionId: number; artistName: string }) =>
    cancelSubscription({ subscriptionId: subscription.subscriptionId }),
);

export const cancelSubscriptionReducer = {
  [cancelSubscriptionAction.STARTED]: (state: typeof initialState, { payload }) => ({
    ...state,
    processing: true,
    artistPageId: payload.artistPageId,
    artistName: payload.artistName,
    artistSlug: payload.artistSlug,
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
    artistName: undefined,
    artistSlug: undefined,
  }),
};
