import { apiAxios } from '../setup-axios';

export const login = async (username: string, password: string) => {
  const { headers } = await apiAxios({
    method: 'post',
    url: '/users/sign_in.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { user: { email: username, password } },
  });

  return { token: headers.authorization };
};
