import { apiAxios } from '../setup-axios';

export const logout = async () => {
  await apiAxios({
    method: 'delete',
    url: '/users/sign_out.json',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
