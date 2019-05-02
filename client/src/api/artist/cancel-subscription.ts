import { apiAxios } from '../setup-axios';

export const cancelSubscription = async ({ subscriptionId }: { subscriptionId: number }) => {
  const { data } = await apiAxios({
    method: 'delete',
    url: `/subscriptions/${subscriptionId}`,
  });

  return { cancelResult: data };
};
