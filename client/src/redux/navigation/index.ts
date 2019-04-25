import { handleActions } from 'redux-actions';

import { initialState } from './initial-state';
import { saveNavigationStateReducer } from './save-navigation-state';

export const combinedReducers = {
  ...saveNavigationStateReducer,
};

export const navigation = handleActions(combinedReducers, initialState);
