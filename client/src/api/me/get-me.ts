import axios from 'axios';

export const getMeData = async () => {
  console.log("getting me")
  const { data } = await axios({
    method: 'get',
    url: '/me',
  });

  return { me: data };
};
