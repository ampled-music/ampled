export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  stripeApiKey:
    process.env.REACT_APP_STRIPE_API_KEY ||
    'pk_test_aTJ8eejqwF4Jdavp5DvlM9s7007l3Gps6E',
  localStorageKeys: {
    token: 'token',
  },
  menuUrls: {
    createArtist: process.env.REACT_APP_URL_CREATE_ARTIST || '/create-artist',
    blog: process.env.REACT_APP_URL_BLOG || '/zine',
    about: process.env.REACT_APP_URL_ABOUT || '/page/about',
  },
  cloudinary: {
    uploadImageUrl: 'https://api.cloudinary.com/v1_1/ampled-web/upload',
    deleteImageUrl:
      'https://api.cloudinary.com/v1_1/ampled-web/delete_by_token',
    apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
    apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
  },
  aws: {
    playableBaseUrl:
      process.env.REACT_APP_AWS_BASE_URL ||
      'https://ampled-test.s3.amazonaws.com/',
  },
};
