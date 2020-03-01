import { handleActions } from 'redux-actions';

import { toastReducer } from './toast-modal';
import { initialState } from './initial-state';

const combinedReducers = {
  ...toastReducer,
};

export const toast = handleActions(combinedReducers, initialState);
