import axios from 'axios';
import sha1 from 'sha1';
import { config } from '../../config';

const createSignature = (timestamp) => {
  const hashString = `return_delete_token=true&timestamp=${timestamp}${config.cloudinary.apiSecret}`;

  return sha1(hashString);
};
export const uploadFileToCloudinary = async (file: any) => {
  const timestamp = Date.now();
  const signature = createSignature(timestamp);

  const formData = new FormData();
  formData.append('api_key', config.cloudinary.apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('file', file);
  formData.append('return_delete_token', 'true');
  const reqConfig = {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  };

  try {
    console.log(
      'Trying to upload to: ',
      `https://api.cloudinary.com/v1_1/${config.cloudinary.cloud_name}/upload`,
    );
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${config.cloudinary.cloud_name}/upload`,
      formData,
      reqConfig,
    );

    return data;
  } catch (err) {
    return undefined;
  }
};
