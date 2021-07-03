import * as store from 'store';
import * as Sentry from '@sentry/browser';

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

    Sentry.configureScope((scope) => scope.setUser(null));

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

    Sentry.configureScope(function(scope) {
      scope.setUser({ email, id });
    });

  return {
    ...data.userInfo,
    artistPages: data.artistPages,
    ownedPages: data.ownedPages,
    subscriptions: data.subscriptions,
    notifications: data.notifications || []
  };
};
