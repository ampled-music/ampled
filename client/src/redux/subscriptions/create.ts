import { createActionThunk } from 'redux-thunk-actions';

import { createSubscription } from '../../api/artist/create-subscription';
import { actions } from './actions';

export const createSubscriptionAction = createActionThunk(
  actions.createSubscription,
  (subscription: { artistPageId: number; subscriptionLevelValue: number }) => createSubscription(subscription),
);

export const createSubscriptionReducer = {
  [createSubscriptionAction.STARTED]: (state) => ({
    ...state,
    creatingSubscription: true,
  }),
  [createSubscriptionAction.SUCCEEDED]: (state) => ({
    ...state,
    subscriptionCreated: true,
  }),
  [createSubscriptionAction.FAILED]: (state, { payload }) => ({
    ...state,
    error: payload,
  }),
  [createSubscriptionAction.ENDED]: (state) => ({
    ...state,
    subscriptionCreated: false,
    creatingSubscription: false,
  }),
};
