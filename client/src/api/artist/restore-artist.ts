import { apiAxios } from '../setup-axios';

export const restoreArtist = async (artistId) => {
  const response = await apiAxios({
    method: 'put',
    url: `/artist_pages/restore/${artistId}`,
  });

  return response;
};
