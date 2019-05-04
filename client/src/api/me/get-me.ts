import * as store from 'store';

import { apiAxios } from '../setup-axios';

export const getMeData = async () => {
  if (!store.get('token')) {
    return undefined;
  }

  const { data } = await apiAxios({
    method: 'get',
    url: '/me.json',
  });

  if (data && !data.userInfo.id) {
    store.clearAll();

    return undefined;
  }

  return {
    ...data.userInfo,
    artistPages: data.artistPages,
    ownedPages: data.ownedPages,
    subscriptions: data.subscriptions,
  };
};
