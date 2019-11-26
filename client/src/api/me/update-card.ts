import { apiAxios } from '../setup-axios';

export const updateCard = async (token) => {
  const { data } = await apiAxios({
    method: 'put',
    url: '/me/updatecard.json',
    data: {
      token
    },
  });
  return {
    ...data,
    cardInfo: {
      exp_month: data.card_exp_month,
      exp_year: data.card_exp_year,
      brand: data.card_brand,
      last4: data.card_last4,
    }
  };
};
