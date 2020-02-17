import { apiAxios } from '../setup-axios';

export const signUp = async (
  username: string,
  password: string,
  passwordConfirmation: string,
  name: string,
  last_name: string,
  redirect?: string,
) => {
  const { data } = await apiAxios({
    method: 'post',
    url: '/users.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      user: {
        email: username,
        password,
        passwordConfirmation,
        name,
        last_name,
        redirect_uri: redirect || null,
      },
    },
  });

  return { data };
};
