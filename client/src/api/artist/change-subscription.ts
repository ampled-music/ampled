import { apiAxios } from '../setup-axios';

export const changeSubscription = async ({
  subscriptionId,
  subscriptionAmount,
}: {
  subscriptionId: number;
  subscriptionAmount: number;
}) => {
  const { data } = await apiAxios({
    method: 'put',
    url: `/subscriptions/${subscriptionId}?new_price=${subscriptionAmount}`,
  });

  if (data && data.status && data.status === 'error') {
    throw data.message;
  }

  return { subscriptionResult: data };
};
