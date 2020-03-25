/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');

const middleware = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
});

module.exports = function(app) {
  app.use('/*.json', middleware);
  app.use('/uploads/*', middleware);
  app.use('/subscriptions*', middleware);
};
