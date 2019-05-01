import { createActionThunk } from 'redux-thunk-actions';

import { createSubscription } from '../../api/artist/create-subscription';
import { actions } from './actions';
import { initialState, SubscriptionStep } from './initial-state';

export const createSubscriptionAction = createActionThunk(
  actions.createSubscription,
  (subscription: { artistPageId: number; subscriptionLevelValue: number; paymentToken: string }) =>
    createSubscription(subscription),
);

export const createSubscriptionReducer = {
  [createSubscriptionAction.STARTED]: (state: typeof initialState) => ({
    ...state,
    processing: true,
  }),
  [createSubscriptionAction.SUCCEEDED]: (state: typeof initialState) => ({
    ...state,
    status: SubscriptionStep.Finished,
  }),
  [createSubscriptionAction.FAILED]: (state: typeof initialState, { payload }) => ({
    ...state,
    error: payload,
  }),
  [createSubscriptionAction.ENDED]: (state: typeof initialState) => ({
    ...state,
    processing: initialState.processing,
    status: initialState.status,
  }),
};
