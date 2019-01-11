import { apiAxios } from '../setup-axios';

export const getArtist = async (artistId: string) => {
  const { data } = await apiAxios({
    method: 'get',
    url: `/artist_pages/${artistId}.json`,
  });

  return { artist: data };
};
