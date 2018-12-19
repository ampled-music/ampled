import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';

import { artist, getArtistData, initialState } from './get-artist';

describe('get-artist duck', () => {
  let store;
  let httpMock;

  beforeEach(() => {
    httpMock = new MockAdapter(axios);
    const mockStore = configureMockStore();
    store = mockStore(initialState);
  });

  describe('get artist', () => {
    describe('calling the action', () => {
      it('returns "artist" payload in case of success', async () => {
        const artistPayload = {
          artist: { name: 'Artist Name' },
        };

        httpMock.onGet('/artist_pages/1.json').reply(200, artistPayload);

        await getArtistData(1)(store.dispatch);

        const executedActions = store.getActions();
        const succeededPayload = executedActions.find((action) => action.type === getArtistData.SUCCEEDED);

        expect(executedActions.map((action) => action.type)).toEqual([
          getArtistData.START,
          getArtistData.SUCCEEDED,
          getArtistData.ENDED,
        ]);

        expect(succeededPayload).toEqual({
          type: getArtistData.SUCCEEDED,
          payload: { artist: artistPayload },
        });
      });

      it('when receiving a bad request returns error payload', async () => {
        httpMock.onGet('/artist_pages/1.json').reply(400, {
          error: 'Error',
        });

        await getArtistData(1)(store.dispatch);

        const executedActions = store.getActions();
        const failedPayload = executedActions.find((action) => action.type === getArtistData.FAILED);

        expect(executedActions.map((action) => action.type)).toEqual([
          getArtistData.START,
          getArtistData.FAILED,
          getArtistData.ENDED,
        ]);

        expect(failedPayload).toEqual({
          type: getArtistData.FAILED,
          payload: { error: 'Error' },
        });
      });
    });

    describe('reducer', () => {
      let startedState = { artist: {}, loading: true, error: null };
      let succeededState = { artist: { name: 'Artist Name' }, loading: true, error: null };

      it('activates loading on start reducer', async () => {
        const startReducer = artist(initialState, { type: getArtistData.START });

        expect(startReducer).toEqual(startedState);
      });

      it('adds "artist" data when it succeeds', async () => {
        const succeededReducer = artist(startedState, {
          type: getArtistData.SUCCEEDED,
          payload: { artist: { name: 'Artist Name' } },
        });

        expect(succeededReducer).toEqual(succeededState);
      });

      it('adds error data when it fails', async () => {
        const failedReducer = artist(startedState, { type: getArtistData.FAILED, payload: { error: 'OPS' } });

        expect(failedReducer).toEqual({ error: 'OPS', loading: false, artist: {} });
      });

      it('sets loading equals to false when it ends', async () => {
        const succeededReducer = artist(succeededState, {
          type: getArtistData.ENDED,
          payload: { artist: { name: 'Artist Name' } },
        });

        expect(succeededReducer).toEqual({ artist: { name: 'Artist Name' }, loading: false, error: null });
      });
    });
  });
});
