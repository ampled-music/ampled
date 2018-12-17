import axios from 'axios';

export const getArtistsPages = async () => {
  const { data } = await axios({
    method: 'get',
    url: '/artist_pages.json',
  });

  return { pages: data };
};
