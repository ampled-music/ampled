import { apiAxios } from '../setup-axios';

export const getArtistsPages = async () => {
  const { data } = await apiAxios({
    method: 'get',
    url: '/artist_pages.json',
  });

  return { pages: data };
};
