import axios from 'axios';

export const signUp = async (username: string, password: string, passwordconfirmation: string, name: string) => {
  const { data } = await axios({
    method: 'post',
    url: '/users.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { user: { email: username, password, passwordconfirmation, name } },
  });

  return { data };
};
