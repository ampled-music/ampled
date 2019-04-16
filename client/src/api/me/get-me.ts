import * as store from 'store';

import { apiAxios } from '../setup-axios';

export const getMeData = async () => {
  if (!store.get('token')) {
    return undefined;
  }

  const { data } = await apiAxios({
    method: 'get',
    url: '/me',
  });

  return data
    ? {
        ...data.userInfo,
        artistPages: data.artistPages,
      }
    : undefined;
};
