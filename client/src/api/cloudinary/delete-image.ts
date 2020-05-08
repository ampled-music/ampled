import axios from 'axios';
import { config } from '../../config';

export const deleteFileFromCloudinary = async (deleteToken: string) => {
  try {
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
  } catch (e) {
    console.log('Removing from Cloudinary failed.');
  }
};
