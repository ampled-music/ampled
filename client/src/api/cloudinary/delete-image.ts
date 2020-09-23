import axios from 'axios';
import { config } from '../../config';

export const deleteFileFromCloudinary = async (deleteToken: string) => {
  try {
    await axios({
      method: 'post',
      url: `https://api.cloudinary.com/v1_1/${config.cloudinary.cloud_name}/delete_by_token`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        token: deleteToken,
      },
    });
  } catch (e) {
    console.log('Removing from Cloudinary failed.');
  }
};
