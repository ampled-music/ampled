import { apiAxios } from '../setup-axios';

export const deleteArtist = async (artistId) => {
  const response = await apiAxios({
    method: 'delete',
    url: `/artist_pages/${artistId}.json?cancel_subscriptions=true`,
  });

  return response;
};
