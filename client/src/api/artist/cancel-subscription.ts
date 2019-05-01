import { apiAxios } from '../setup-axios';

export const cancelSubscription = async (subscription: { artistPageId: number }) => {
  const { data } = await apiAxios({
    method: 'delete',
    url: `/subscriptions`,
    data: { artist_page_id: subscription.artistPageId },
  });

  return { cancelResult: data };
};
