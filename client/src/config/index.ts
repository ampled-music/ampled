export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  localStorageKeys: {
    token: 'token',
  },
  authUrl: {
    google: process.env.REACT_APP_GOOGLE_AUTH_URL || '/api/auth/google',
    linkedIn: process.env.REACT_APP_LINKEDIN_AUTH_URL || '/api/auth/linkedin',
    facebook: process.env.REACT_APP_FACEBOOK_AUTH_URL || '/api/auth/facebook',
  },
  cloudinary: {
    uploadImageUrl: 'https://api.cloudinary.com/v1_1/ampled-web/upload',
    apiKey: process.env.CLOUDINARY_API_KEY || '744875614849321',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'vkrV4k_iOlct_pt0Ue-DukQCIXQ',
  },
};
