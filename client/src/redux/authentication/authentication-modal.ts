import { createAction } from 'redux-actions';

import { actions } from './actions';
import { initialState } from './initial-state';

export const openAuthModalAction = createAction(actions.openAuthModal);
export const closeAuthModalAction = createAction(actions.closeAuthModal);

export const authModalReducer = {
  [actions.openAuthModal]: (state, { payload }) => ({
    ...state,
    authModalOpen: true,
    modalPage: payload.modalPage,
    showSupportMessage: payload.showSupportMessage,
    customLoginMessage: payload.customLoginMessage,
    onModalCloseAction: payload.onModalCloseAction,
    artistName: payload.artistName,
    artistSlug: payload.artistSlug,
    redirectTo: payload.redirectTo,
  }),
  [actions.closeAuthModal]: (state) => ({
    ...state,
    authModalOpen: false,
  }),
} as Reducer;

interface Reducer {
  [key: string]: (
    state: typeof initialState,
    action: any,
  ) => typeof initialState;
}
