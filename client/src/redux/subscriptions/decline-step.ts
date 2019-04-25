import { createAction } from 'redux-actions';

import { actions } from './actions';
import { Reducer, SubscriptionStep } from './initial-state';

export const declineStepAction = createAction(actions.declineStep);

export const declineStepReducer = {
  [actions.declineStep]: (state) => ({
    ...state,
    status: SubscriptionStep.SupportLevel,
  }),
} as Reducer;
