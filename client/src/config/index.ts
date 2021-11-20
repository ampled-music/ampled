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
    blog: process.env.REACT_APP_URL_BLOG || '/blog',
    about: process.env.REACT_APP_URL_ABOUT || '/page/about-us',
    browse: process.env.REACT_APP_URL_BROWSE || '/browse',
  },
  cloudinary: {
    cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'ampled-web',
  },
  aws: {
    playableBaseUrl:
      process.env.REACT_APP_AWS_BASE_URL ||
      'https://ampled-test.s3.amazonaws.com/',
  },
  materialUi: {
    key: process.env.REACT_APP_MATERIAL_UI_KEY,
  },
};
