import { apiAxios } from '../setup-axios';

export const signUp = async (username: string, password: string, passwordConfirmation: string, name: string) => {
  const { data } = await apiAxios({
    method: 'post',
    url: '/users.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { user: { email: username, password, passwordConfirmation, name } },
  });

  return { data };
};
