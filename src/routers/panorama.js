const Response = require('../utils/response');
const ConfigController = require('../controllers/config');
const PanoramaController = require('../controllers/panorama');

/**
 * 配置路由
 * @param {Object} router koa-router 对象
 */
function route(router) {

  router.get('/', (ctx, next) => {
    ctx.redirect('/page/panoramas');
  });

  // 全景项目列表页
  router.get('/page/panoramas', async (ctx, next) => {
    try {
      const krpanoPath = await ConfigController.getKrpanoPath();
      const panoramas = await PanoramaController.getList();
      return ctx.render('list', {
        panoramas,
        configured: !!krpanoPath
      });
    } catch (e) {
      return ctx.render('error');
    }
  });

  // 全景项目展示页
  router.get('/page/panoramas/:id', async (ctx, next) => {
    ctx.body = await PanoramaController.renderHTML();
  });

  // 全景项目编辑页
  router.get('/page/panoramas/:id/edit', async (ctx, next) => {
    try {
      const id = ctx.params.id;
      const panorama = await PanoramaController.getDetail(id);
      switch (panorama.stage) {
        case 'init':
          return ctx.render('upload', {id, images: []});
        case 'uploaded':
          const images = await PanoramaController.getSceneImages(id);
          return ctx.render('upload', {id, images});
        case 'generated':
          return ctx.render('edit', {id});
      }
    } catch (e) {
      return ctx.render('error');
    }
  });


  // 获取全景项目详情数据接口
  router.get('/api/panoramas/:id', async (ctx, next) => {
    try {
      const id = ctx.params.id;
      const data = await PanoramaController.getFullDetail(id);
      ctx.body = Response.success(data);
    } catch (e) {
      ctx.body = Response.error();
    }
  });

  // 创建全景项目接口
  router.post('/api/panoramas', async (ctx, next) => {
    try {
      const {name} = ctx.request.body || {};
      const id = await PanoramaController.create({name});
      ctx.body = Response.success(id);
    } catch (e) {
      ctx.body = Response.error();
    }
  });

  // 删除全景项目接口
  router.del('/api/panoramas/:id', async (ctx, next) => {
    try {
      const id = ctx.params.id;
      await PanoramaController.del(id);
      ctx.body = Response.success();
    } catch (e) {
      console.log(e)
      ctx.body = Response.error();
    }
  });

  // 上传全景图片接口
  router.post('/api/panoramas/:id/upload', async (ctx, next) => {
    try {
      const id = ctx.params.id;
      const data = await PanoramaController.upload(ctx, id);
      ctx.body = Response.success(data);
    } catch (e) {
      ctx.body = Response.error();
    }
  });

  // 生成全景H5页面
  router.post('/api/panoramas/:id/generate', async (ctx, next) => {
    try {
      const id = ctx.params.id;
      await PanoramaController.generate(id);
      ctx.body = Response.success();
    } catch (e) {
      console.log(e)
      ctx.body = Response.error();
    }
  });
}

module.exports = {
  route
};
