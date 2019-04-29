import { apiAxios } from '../setup-axios';

export const updateMe = async (me) => {
  const { data } = await apiAxios({
    method: 'update',
    url: '/me.json',
    data: me,
  });

  return data;
};
