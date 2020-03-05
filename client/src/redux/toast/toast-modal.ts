import { createAction } from 'redux-actions';

import { actions } from './actions';
import { initialState } from './initial-state';

export const showToastAction = createAction(actions.showToast);
export const hideToastAction = createAction(actions.hideToast);

export const toastReducer = {
  [actions.showToast]: (state, { payload }) => ({
    ...state,
    visible: true,
    isFading: false,
    message: payload.message,
    type: payload.type,
  }),
  [actions.hideToast]: (state) => ({
    ...state,
    visible: false,
    isFading: false,
    message: undefined,
  }),
} as Reducer;

interface Reducer {
  [key: string]: (
    state: typeof initialState,
    action: any,
  ) => typeof initialState;
}
