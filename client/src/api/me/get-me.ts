import * as store from 'store';

import { apiAxios } from '../setup-axios';

declare global {
  interface Window {
    dataLayer: any;
    Sentry: any;
  }
}

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

  const { name, last_name, id, email } = data.userInfo;
  if (window.dataLayer) {
    window.dataLayer.push({
      userName: `${name} ${last_name}`,
      userEmail: email,
      userId: id,
      event: 'getMe',
    });
  }

  if (window.Sentry) {
    window.Sentry.configureScope(function(scope) {
      scope.setUser({ email, id });
    });
  }

  return {
    ...data.userInfo,
    artistPages: data.artistPages,
    ownedPages: data.ownedPages,
    subscriptions: data.subscriptions,
  };
};
