import { handleActions } from 'redux-actions';

import { cancelSubscriptionReducer } from './cancel';
import { createSubscriptionReducer } from './create';
import { declineStepReducer } from './decline-step';
import { initialState } from './initial-state';
import { startSubscriptionReducer } from './start-subscription';

const combinedReducers = {
  ...createSubscriptionReducer,
  ...cancelSubscriptionReducer,
  ...startSubscriptionReducer,
  ...declineStepReducer,
};

export const subscriptions = handleActions(combinedReducers, initialState);
