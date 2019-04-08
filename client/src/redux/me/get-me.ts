import { createActionThunk } from 'redux-thunk-actions';

import { getMeData } from '../../api/me/get-me';
import { actions } from './actions';
import { Reducer } from './initial-state';

export const getMeAction = createActionThunk(actions.getMe, () => getMeData());

export const getMeReducer = {
  [getMeAction.STARTED]: (state) => ({
    ...state,
    loading: true,
  }),
  [getMeAction.SUCCEEDED]: (state, action) => ({
    ...state,
    me: action.payload,
  }),
  [getMeAction.FAILED]: (state, action) => ({
    ...state,
    loading: false,
    error: action.payload,
  }),
  [getMeAction.ENDED]: (state) => ({
    ...state,
    loading: false,
  }),
} as Reducer;
