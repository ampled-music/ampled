import { apiAxios } from '../setup-axios';

export const updateMe = async (me) => {
  const { data } = await apiAxios({
    method: 'put',
    url: '/users.json',
    data: me,
  });

  return { profileImageUrl: me.profile_image_url, data };
};
