import { apiAxios } from '../setup-axios';

export const createSubscription = async (subscription: { artistPageId: number; subscriptionLevelValue: number }) => {
  const { data } = await apiAxios({
    method: 'post',
    url: `/subscriptions`,
    data: { artist_page_id: subscription.artistPageId },
  });

  return { subscriptionResult: data };
};
