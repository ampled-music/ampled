import axios from 'axios';

export const signinFile = async (fileType) => {
  const { data } = await axios({
    method: 'get',
    url: `/uploads/sign?contentType=${fileType}`,
  });

  return data;
};
