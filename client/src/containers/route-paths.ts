export const routePaths = {
  root: '/',
  artists: '/artists/:id',
  slugs: '/artist/:slug',
  promote: '/artist/:slug/promote',
  viewPost: '/artist/:slug/post/:postId',
  editArtist: '/artist/:slug/edit',
  capsSlugs: '/(artist|support)/([a-zA-Z0-9-]*[A-Z]+[a-zA-Z0-9-]*)',
  support: '/support/:id',
  createPost: '/create_post/:id',
  connect: '/connect',
  home: '/home',
  passwordReset: '/users/password/edit',
  forgotPassword: '/reset-password',
  upload: '/upload',
  settings: '/settings',
  userDetails: '/user-details',
  createArtist: '/create-artist',
  noArtist: '/no_artist',
  browse: '/browse',
  metrics: '/metrics',
  feed: '/feed',
  page: '/page/:slug',
  blog: '/blog',
  blogPost: '/blog/:slug',
  community: '/community',
};
