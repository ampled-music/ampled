import axios from 'axios';

export const getArtist = async (artistId) => {
  const { data } = await axios({
    method: 'get',
    url: `/artist_pages/${artistId}.json`,
  });

  console.log(data);

  return { artist: data };
};
