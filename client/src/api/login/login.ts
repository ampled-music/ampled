import axios from 'axios';

export const login = async (username: string, password: string) => {
  const { data } = await axios({
    method: 'post',
    url: '/users/sign_in.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { username, password },
  });

  return { token: data };
};
