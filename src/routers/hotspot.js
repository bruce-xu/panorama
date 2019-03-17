const Response = require('../utils/response');
const HotspotController = require('../controllers/hotspot');

/**
 * 配置路由
 * @param {Object} router koa-router 对象
 */
function route(router) {
  // 获取特定全景项目下所有热点数据接口
  router.get('/api/hotspots', async (ctx, next) => {
    const {scene_id} = ctx.request.body || {};
    ctx.body = await HotspotController.query({
      scene_id
    });
  });

  // 获取单个热点信息接口
  router.get('/api/hotspots/:id', async (ctx, next) => {
    const id = ctx.params.id;
    ctx.body = await HotspotController.query(id);
  });

  // 创建热点接口
  router.post('/api/hotspots', async (ctx, next) => {
    console.log(ctx.request.body)
    const {type, url, ath, atv, scene_id, extra} = ctx.request.body || {};
    ctx.body = await HotspotController.create({
      type, url, ath, atv, scene_id, extra
    });
  });

  // 更新热点接口
  router.put('/api/hotspots', async (ctx, next) => {
    const {id, type, url, ath, atv, scene_id, extra} = ctx.request.body || {};
    ctx.body = await HotspotController.update({
      type, url, ath, atv, scene_id, extra
    }, {id});
  });
}

module.exports = {
  route
};
