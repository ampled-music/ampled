import { apiAxios } from '../setup-axios';

export const markNotificationRead = async (id: string | number) =>
  await apiAxios({
    method: 'post',
    url: `/notifications/${id}/read`,
  });

export const markAllNotificationsRead = async () =>
  await apiAxios({
    method: 'post',
    url: `/notifications/read_all`,
  });
