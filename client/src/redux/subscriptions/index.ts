import { handleActions } from 'redux-actions';

import { createSubscriptionReducer } from './create';
import { initialState } from './initial-state';

const combinedReducers = {
  ...createSubscriptionReducer,
};

export const subscriptions = handleActions(combinedReducers, initialState);
