import { apiAxios } from '../setup-axios';

export const createSubscription = async (subscription: {
  artistPageId: number;
  paymentToken: string;
  subscriptionLevelValue: number;
}) => {
  const { data } = await apiAxios({
    method: 'post',
    url: `/subscriptions`,
    data: { 
      artist_page_id: subscription.artistPageId,
      token: subscription.paymentToken,
      amount: subscription.subscriptionLevelValue,
    },
  });

  return { subscriptionResult: data };
};
