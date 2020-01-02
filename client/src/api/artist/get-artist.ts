import { apiAxios } from '../setup-axios';

export const getArtist = async (artistId: string, slug?: string) => {
  let url;
  if (slug && !artistId) {
    url = `/slug/${slug.toLowerCase()}.json`;
  } else {
    url = `/artist_pages/${artistId}.json`;
  }
  const { data } = await apiAxios({
    method: 'get',
    url,
  });

  return { artist: data };
};
