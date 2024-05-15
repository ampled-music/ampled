import axios from 'axios';

export const uploadFileToCloudinary = async (file: any) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await axios.post(`/uploads/cloudinary`, formData);
    return data;
  } catch (err) {
    return undefined;
  }
};
