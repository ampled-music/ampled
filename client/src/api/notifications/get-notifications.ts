import { apiAxios } from '../setup-axios';

export const getNotifications = async () =>
  await apiAxios({
    method: 'get',
    url: `/notifications.json`,
  });
