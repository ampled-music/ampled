import { apiAxios } from '../setup-axios';

export const getArtist = async (slug: string) => {
  const url = `/slug/${slug.toLowerCase()}.json`;

  const { data } = await apiAxios({
    method: 'get',
    url,
  });

  return { artist: data };
};
