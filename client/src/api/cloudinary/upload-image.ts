import axios from 'axios';
import sha1 from 'sha1';
import { config } from '../../config';

const createSignature = (timestamp) => {
  const hashString = `return_delete_token=true&timestamp=${timestamp}${config.cloudinary.apiSecret}`;

  return sha1(hashString);
};
export const uploadFileToCloudinary = async (
  file: any,
  coordinates?: string,
) => {
  const timestamp = Date.now();
  const signature = createSignature(timestamp);

  const formData = new FormData();
  formData.append('api_key', config.cloudinary.apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('file', file);
  formData.append('custom_coordinates', coordinates);
  formData.append('return_delete_token', 'true');
  const reqConfig = {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  };

  try {
    const { data } = await axios.post(
      config.cloudinary.uploadImageUrl,
      formData,
      reqConfig,
    );

    return data;
  } catch (err) {
    return undefined;
  }
};
