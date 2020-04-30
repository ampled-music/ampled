import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';

import { artistsPages, initialState, pages } from './get-artists-pages';

describe('get-artists-pages duck', () => {
  let store;
  let httpMock;

  beforeEach(() => {
    httpMock = new MockAdapter(axios);
    const mockStore = configureMockStore();
    store = mockStore(initialState);
  });

  describe('get artists pages', () => {
    describe('calling the action', () => {
      xit('returns "artists pages" payload in case of success', async () => {
        const pagesPayload = {
          pages: [
            { page1: { name: 'Page1 Name' } },
            { page2: { name: 'Page2 Name' } },
            { page3: { name: 'Page3 Name' } },
          ],
        };

        httpMock.onGet('/artist_pages.json').reply(200, pagesPayload);

        await artistsPages()(store.dispatch);

        const executedActions = store.getActions();
        const succeededPayload = executedActions.find((action) => action.type === artistsPages.SUCCEEDED);

        expect(executedActions.map((action) => action.type)).toEqual([
          artistsPages.START,
          artistsPages.SUCCEEDED,
          artistsPages.ENDED,
        ]);

        expect(succeededPayload).toEqual({
          type: artistsPages.SUCCEEDED,
          payload: { pages: pagesPayload },
        });
      });

      xit('when receiving a bad request returns error payload', async () => {
        httpMock.onGet('/artist_pages.json').reply(400, {
          error: 'Error',
        });

        await artistsPages()(store.dispatch);

        const executedActions = store.getActions();
        const failedPayload = executedActions.find((action) => action.type === artistsPages.FAILED);

        expect(executedActions.map((action) => action.type)).toEqual([
          artistsPages.START,
          artistsPages.FAILED,
          artistsPages.ENDED,
        ]);

        expect(failedPayload).toEqual({
          type: artistsPages.FAILED,
          payload: { error: 'Error' },
        });
      });
    });

    describe('reducer', () => {
      let startedState = { pages: {}, loading: true, error: null };
      let succeededState = {
        pages: [
          { page1: { name: 'Page1 Name' } },
          { page2: { name: 'Page2 Name' } },
          { page3: { name: 'Page3 Name' } },
        ],
        loading: true,
        error: null,
      };

      it('activates loading on start reducer', async () => {
        const startReducer = pages(initialState, { type: artistsPages.START });

        expect(startReducer).toEqual(startedState);
      });

      it('adds "artists pages" data when it succeeds', async () => {
        const succeededReducer = pages(startedState, {
          type: artistsPages.SUCCEEDED,
          payload: {
            pages: [
              { page1: { name: 'Page1 Name' } },
              { page2: { name: 'Page2 Name' } },
              { page3: { name: 'Page3 Name' } },
            ],
          },
        });

        expect(succeededReducer).toEqual(succeededState);
      });

      it('adds error data when it fails', async () => {
        const failedReducer = pages(startedState, { type: artistsPages.FAILED, payload: { error: 'OPS' } });

        expect(failedReducer).toEqual({ error: 'OPS', loading: false, pages: {} });
      });

      it('sets loading equals to false when it ends', async () => {
        const succeededReducer = pages(succeededState, {
          type: artistsPages.ENDED,
          payload: {
            pages: [
              { page1: { name: 'Page1 Name' } },
              { page2: { name: 'Page2 Name' } },
              { page3: { name: 'Page3 Name' } },
            ],
          },
        });

        expect(succeededReducer).toEqual({
          pages: [
            { page1: { name: 'Page1 Name' } },
            { page2: { name: 'Page2 Name' } },
            { page3: { name: 'Page3 Name' } },
          ],
          loading: false,
          error: null,
        });
      });
    });
  });
});
