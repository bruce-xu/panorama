const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v1');
const config = require('../config');
const Response = require('../utils/response');
const Uploader = require('../utils/uploader');
const Krpano = require('../utils/krpano');
const ConfigModel = require('../models/config');
const PanoramaModel = require('../models/panorama');
const SceneModel = require('../models/scene');
const HotspotModel = require('../models/hotspot');


/**
 * 获取全景项目列表
 * @return {promise} 
 */
function getList() {
  return PanoramaModel.getList();
}

/**
 * 获取全景项目列表
 * @param  {string} id 全景项目ID
 * @return {promise} 
 */
function getDetail(id) {
  return PanoramaModel.getDetail(id);
}

/**
 * 获取全景信息（包括场景和热点信息）
 * @param  {string} id 全景项目ID
 * @return {promise} 
 */
function getFullDetail(id) {
  // 获取全景项目
  return PanoramaModel.getDetail(id)
    .then((panorama) => {
      // 获取全景项目中的场景
      return SceneModel.getScenesByPanorama(id)
        .then((scenes) => {
          const sceneIds = scenes.map((scene) => scene.id);
          panorama.scenes = scenes;
          // 获取场景中的热点
          return HotspotModel.getHotspotsByScenes(sceneIds)
            .then((hotspots) => {
              const hotspotMap = {};
              hotspots.forEach((hotspot) => {
                if (!hotspotMap[hotspot.scene_id]) {
                  hotspotMap[hotspot.scene_id] = [];
                }
                hotspotMap[hotspot.scene_id].push(hotspot);
              });
              scenes.forEach((scene) => {
                scene.hotspots = hotspotMap[scene.id] || [];
              });

              return panorama;
            });
        });
    });
}

/**
 * 获取项目下上传的的场景图片
 * @param  {string} id 全景项目ID
 * @return {promise}         
 */
function getSceneImages(id) {
  return SceneModel.getScenesByPanorama(id)
    .then((scenes) => {
      const images = [];
      scenes.forEach((scene) => {
        images.push(scene.img);
      });
      return images;
    })
}

/**
 * 创建全景项目
 * @param  {object} options 创建参数
 * @return {promise}         
 */
function create(options) {
  const path = uuid();
  const name = options.name;
  return PanoramaModel.create({path, name});
}

/**
 * 删除全景项目
 * @param  {string} id 全景项目ID
 * @return {promise}         
 */
function del(id) {
  return SceneModel.getScenesByPanorama(id)
    .then((scenes) => {
      console.log(scenes)
      const sceneIds = [];
      scenes.forEach((scene) => {
        sceneIds.push(scene.id);
      });
      return sceneIds;
    })
    .then((sceneIds) => {
      return HotspotModel.deleteHotspotsByScenes(sceneIds);
    })
    .then(() => {
      return SceneModel.deleteScenesByPanorama(id);
    })
    .then(() => {
      return PanoramaModel.del(id);
    });
}

/**
 * 上传场景图片
 * @param  {Object} ctx koa上下文
 * @param  {string} id 全景项目ID
 * @return {promise}         
 */
function upload(ctx, id) {
  let images = [];
  return PanoramaModel.getDetail(id)
    .then((panorama) => {
      return {
        id,
        path: panorama.path,
        uploadFolder: path.join(config.UPLOAD_PATH, panorama.path)
      };
    })
    .then((options) => {
      return Uploader.upload(ctx, options);
    })
    .then((data) => {
      images = data.map(item => item.img);
      return SceneModel.batchInsert(data);
    })
    .then(() => {
      return PanoramaModel.update({stage: 'uploaded'}, {id});
    })
    .then(() => {
      return images;
    });
}

/**
 * 生成全景项目H5页面
 * @param  {object} options 文件上传参数
 * @return {promise}         
 */
function generate(id) {
  return PanoramaModel.getDetail(id)
    .then((panorama) => {
      return ConfigModel.getConfig('krpano_path')
        .then((krpanoConfig) => {
          const filePath = path.join(config.UPLOAD_PATH, panorama.path);
          return Krpano.vtour(krpanoConfig.value, filePath);
        })
    })
    .then(() => {
      return PanoramaModel.update({stage: 'generated'}, {id})
    });
}

/**
 * 渲染全景页面
 */
function renderHTML() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../views/panorama.html'), {'encoding': 'utf8'}, function (err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

module.exports = {
  getList,
  getDetail,
  getFullDetail,
  getSceneImages,
  create,
  del,
  upload,
  generate,
  renderHTML
};