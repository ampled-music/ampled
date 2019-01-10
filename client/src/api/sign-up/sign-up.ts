import { apiAxios } from '../setup-axios';

export const signUp = async (username: string, password: string, name: string) => {
  const { headers } = await apiAxios({
    method: 'post',
    url: '/users.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { user: { email: username, password, name } },
  });

  return { token: headers.authorization };
};
