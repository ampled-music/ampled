import axios from 'axios';

export const signUp = async (username: string, password: string, passwordConfirmation: string, name: string) => {
  const { data } = await axios({
    method: 'post',
    url: '/users.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { user: { email: username, password, passwordConfirmation, name } },
  });

  return { data };
};
