import axios from 'axios';
import { config } from '../../config';

export const uploadFileToCloudinary = async (file: any) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log(
      'Trying to upload to: ',
      `https://api.cloudinary.com/v1_1/${config.cloudinary.cloud_name}/upload`,
    );
    console.log('Config: ', config);

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${config.cloudinary.cloud_name}/upload`,
      formData,
    );

    return data;
  } catch (err) {
    return undefined;
  }
};
