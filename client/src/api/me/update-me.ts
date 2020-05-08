import { apiAxios } from '../setup-axios';

export const updateMe = async (me) => {
  const { data } = await apiAxios({
    method: 'put',
    url: '/users.json',
    data: me,
  });

  const profileImageUrl = me.image ? me.image.url : null;
  return { profileImageUrl: profileImageUrl, data };
};
