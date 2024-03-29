/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');

const middleware = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
});

module.exports = function(app) {
  app.use(/\/(me|artist|user|comment|post|slug).*\.json/gi, middleware);
  app.use('/artist/*/post/*/download', middleware);
  app.use('/uploads/*', middleware);
  app.use('/subscriptions*', middleware);
};
