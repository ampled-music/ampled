import axios from 'axios';
import sha1 from 'sha1';
import { config } from '../../config';

export const uploadFileToCloudinary = async (file: any) => {
  const timestamp = Date.now();
  const signature = createSignute(timestamp);

  var fd = new FormData();
  fd.append('api_key', config.cloudinary.apiKey);
  fd.append('timestamp', timestamp.toString());
  fd.append('signature', signature);
  fd.append('file', file);
  const reqConfig = {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  };

  const { data } = await axios.post(config.cloudinary.uploadImageUrl, fd, reqConfig);

  return data.secure_url;
};

const createSignute = (timestamp) => {
  const hashString = `timestamp=${timestamp}${config.cloudinary.apiSecret}`;

  return sha1(hashString);
};
