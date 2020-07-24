import { apiAxios } from '../setup-axios';

export const deleteArtist = async (artistId) => {
  const response = await apiAxios({
    method: 'put',
    url: `/artist_pages/soft_destroy/${artistId}`,
  });

  return response;
};
