import axios from 'axios';
import { config } from '../../config';

export const deleteFileFromCloudinary = async (delete_token: string) => {
  try {
    await axios({
      method: 'post',
      url: config.cloudinary.deleteImageUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        token: delete_token,
      },
    });
  } catch (e) {
    console.log('Removing from Cloudinary failed.');
  }
};
