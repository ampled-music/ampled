import { apiAxios } from '../setup-axios';

export const getArtist = async (artistId: string, slug?: string) => {
  console.log(artistId, slug);
  let url;
  if (slug && !artistId) {
    url = `/slug/${slug}.json`;
  } else {
    url = `/artist_pages/${artistId}.json`;
  }
  const { data } = await apiAxios({
    method: 'get',
    url,
  });

  return { artist: data };
};
