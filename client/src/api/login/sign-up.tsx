import axios from 'axios';

export const signUp = async (username, password, name) => {
  const { data } = await axios({
    method: 'post',
    url: '/users/sign_up.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { username, password, name },
  });

  return { token: data };
};
