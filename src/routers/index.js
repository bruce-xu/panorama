const Router = require('koa-router');
const config = require('./config');
const panorama = require('./panorama');
const scene = require('./scene');
const hotspot = require('./hotspot');

const router = new Router();

config.route(router);
panorama.route(router);
hotspot.route(router);
scene.route(router);

router.get('/(.*)', (ctx, next) => {
  ctx.body = 'Not Found!';
});

module.exports = router;
