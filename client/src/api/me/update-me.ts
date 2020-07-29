import { apiAxios } from '../setup-axios';

export const updateMe = async (me) => {
  const { data } = await apiAxios({
    method: 'put',
    url: '/users.json',
    data: me,
  });
  return { image: me.image, data };
};
