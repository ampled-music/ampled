import axios, { AxiosRequestConfig } from 'axios';

export const uploadFile = async (signinUrl, file, key) => {
  const options: AxiosRequestConfig = {
    url: signinUrl,
    headers: {
      'Content-Type': file.type,
    },
    method: 'PUT',
    data: file,
  };

  return await axios.request(options).then(async () => {
    const response = await axios.get(`uploads/playable_url?key=${key}`);

    return response.data.signedUrl;
  });
};
