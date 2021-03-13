import { createActionThunk } from 'redux-thunk-actions';

import { changeSubscription } from '../../api/artist/change-subscription';
import { actions } from './actions';
import { initialState, SubscriptionStep } from './initial-state';

export const changeSubscriptionAction = createActionThunk(
  actions.changeSubscription,
  (subscription: { subscriptionId: number; subscriptionAmount: number }) =>
    changeSubscription(subscription),
);

export const changeSubscriptionReducer = {
  [changeSubscriptionAction.STARTED]: (state: typeof initialState) => ({
    ...state,
    processing: true,
    hasError: false,
  }),
  [changeSubscriptionAction.SUCCEEDED]: (state: typeof initialState) => ({
    ...state,
    status: SubscriptionStep.Finished,
    hasError: false,
  }),
  [changeSubscriptionAction.FAILED]: (
    state: typeof initialState,
    { payload },
  ) => ({
    ...state,
    error: payload,
    hasError: true,
  }),
  [changeSubscriptionAction.ENDED]: (state: typeof initialState) => ({
    ...state,
    processing: initialState.processing,
    // status: initialState.status,
    // hasError: false,
  }),
};
