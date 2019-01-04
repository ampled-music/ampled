import axios from 'axios';
import sha1 from 'sha1';
import { config } from '../../config';

export const uploadFileToCloudinary = async (file: any) => {
  const timestamp = Date.now();
  const signature = createSignute(timestamp);

  const { data } = await axios({
    method: 'post',
    url: config.cloudinary.uploadImageUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      file,
      api_key: config.cloudinary.apiKey,
      timestamp,
      signature,
    },
  });

  console.log(data);
  // xhr.onreadystatechange = function(e) {
  //   if (xhr.readyState == 4 && xhr.status == 200) {
  //     // File uploaded successfully
  //     var response = JSON.parse(xhr.responseText);
  //     // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
  //     var url = response.secure_url;
  //     // Create a thumbnail of the uploaded image, with 150px width
  //     var tokens = url.split('/');
  //     tokens.splice(-2, 0, 'w_150,c_scale');
  //     var img = new Image(); // HTML5 Constructor
  //     img.src = tokens.join('/');
  //     img.alt = response.public_id;
  //     document.getElementById('gallery').appendChild(img);
  //   }
  // };
};

const createSignute = (timestamp) => {
  const hashString = `timestamp=${timestamp}${config.cloudinary.apiSecret}`;

  return sha1(hashString);
};
