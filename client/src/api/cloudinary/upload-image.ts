import axios from 'axios';
import sha1 from 'sha1';
import { config } from '../../config';

export const uploadFileToCloudinary = async (file: any) => {
  const timestamp = Date.now();
  const signature = createSignature(timestamp);

  var fd = new FormData();
  fd.append('api_key', config.cloudinary.apiKey);
  fd.append('timestamp', timestamp.toString());
  fd.append('signature', signature);
  fd.append('file', file);
  fd.append('return_delete_token', 'true');
  const reqConfig = {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  };

  try {
    const { data } = await axios.post(
      config.cloudinary.uploadImageUrl,
      fd,
      reqConfig,
    );

    return data;
  } catch (err) {
    return undefined;
  }
};

const createSignature = (timestamp) => {
  const hashString = `return_delete_token=true&timestamp=${timestamp}${config.cloudinary.apiSecret}`;

  return sha1(hashString);
};
