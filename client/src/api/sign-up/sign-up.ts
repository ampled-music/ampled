import { apiAxios } from '../setup-axios';

export const signUp = async (username: string, password: string, passwordConfirmation: string, name: string, loginRedirect: string) => {
  const { data } = await apiAxios({
    method: 'post',
    url: '/users.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { user: { email: username, password, passwordConfirmation, name, login_redirect_url: loginRedirect } },
  });

  return { data };
};
