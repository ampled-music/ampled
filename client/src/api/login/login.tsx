import axios from 'axios';

export const login = async (username, password) => {
  const { data } = await axios({
    method: 'post',
    url: '/users/sign_in.json',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { username, password },
  });

  console.log(data);

  return { token: data };
};
