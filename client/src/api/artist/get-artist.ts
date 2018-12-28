import axios from 'axios';

export const getArtist = async (artistId: string) => {
  const { data } = await axios({
    method: 'get',
    url: `/artist_pages/${artistId}.json`,
  });

  return { artist: data };
};
