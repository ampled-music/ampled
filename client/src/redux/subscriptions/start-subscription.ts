import { createAction } from 'redux-actions';

import { actions } from './actions';
import { Reducer, SubscriptionStep } from './initial-state';

export const startSubscriptionAction = createAction(actions.startSubscription);

export const startSubscriptionReducer = {
  [actions.startSubscription]: (state, { payload }) => ({
    ...state,
    artistPageId: payload.artistPageId,
    supportLevelValue: payload.supportLevelValue,
    status: SubscriptionStep.PaymentDetails,
  }),
} as Reducer;
