import axios from 'axios';
import { config } from '../../config';

export const uploadFileToCloudinary = async (file: any) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Trying to upload to /uploads/cloudinary');
    console.log('Config: ', config);

    const { data } = await axios.post('/uploads/cloudinary', formData);

    return data;
  } catch (err) {
    return undefined;
  }
};
