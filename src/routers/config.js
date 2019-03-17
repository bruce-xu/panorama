const Response = require('../utils/response');
const ConfigController = require('../controllers/config');

/**
 * 配置路由
 * @param {Object} router koa-router 对象
 */
function route(router) {
  // 获取特定全景项目下所有热点数据接口
  router.post('/api/configs', async (ctx, next) => {
    try {
      const {krpano_path} = ctx.request.body || {};
      const id = await ConfigController.saveKrpanoPath(krpano_path);
      ctx.body = Response.success();
    } catch (e) {
      console.log(e);
      ctx.body = Response.error();
    }
  });
}

module.exports = {
  route
};
