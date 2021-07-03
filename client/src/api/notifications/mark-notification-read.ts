import { apiAxios } from '../setup-axios';

export const markNotificationRead = async (id: string | number) =>
  await apiAxios({
    method: 'post',
    url: `/notifications/${id}/read`,
  });
