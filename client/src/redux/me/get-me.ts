import { createActionThunk } from 'redux-thunk-actions';

import { getMeData } from '../../api/me/get-me';
import { actions } from './actions';
import { Reducer } from './initial-state';

export const getMeAction = createActionThunk(actions.getMe, () => getMeData());

export const getMeReducer = {
  [getMeAction.STARTED]: (state) => ({
    ...state,
    loadingMe: true,
  }),
  [getMeAction.SUCCEEDED]: (state, { payload }) => ({
    ...state,
    userData: payload,
  }),
  [getMeAction.FAILED]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload,
    userData: undefined,
  }),
  [getMeAction.ENDED]: (state) => ({
    ...state,
    loadingMe: false,
  }),
} as Reducer;
