export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  stripeApiKey: process.env.REACT_APP_STRIPE_API_KEY || 'pk_test_aTJ8eejqwF4Jdavp5DvlM9s7007l3Gps6E',
  localStorageKeys: {
    token: 'token',
  },
  menuUrls: {
    createArtist: process.env.REACT_APP_URL_CREATE_ARTIST || 'https://app.ampled.com/create-an-artist-page',
    blog: process.env.REACT_APP_URL_BLOG || 'https://app.ampled.com/zine',
    about: process.env.REACT_APP_URL_ABOUT || 'https://app.ampled.com/about',
  },
  authUrl: {
    google: process.env.REACT_APP_GOOGLE_AUTH_URL || '/api/auth/google',
    linkedIn: process.env.REACT_APP_LINKEDIN_AUTH_URL || '/api/auth/linkedin',
    facebook: process.env.REACT_APP_FACEBOOK_AUTH_URL || '/api/auth/facebook',
  },
  cloudinary: {
    uploadImageUrl: 'https://api.cloudinary.com/v1_1/ampled-web/upload',
    deleteImageUrl: 'https://api.cloudinary.com/v1_1/ampled-web/delete_by_token',
    apiKey: process.env.CLOUDINARY_API_KEY || '744875614849321',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'vkrV4k_iOlct_pt0Ue-DukQCIXQ',
  },
  aws: {
    playableBaseUrl: process.env.REACT_APP_AWS_BASE_URL || 'https://ampled-test.s3.amazonaws.com/',
  },
};
