import axios from 'axios';
import { config } from '../../config';

export const deleteFileFromCloudinary = async (deleteToken: any) => {
  await axios({
    method: 'post',
    url: config.cloudinary.deleteImageUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      token: deleteToken,
    },
  });
};
