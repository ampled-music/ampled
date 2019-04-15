import { apiAxios } from '../setup-axios';

export const getMeData = async () => {
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
