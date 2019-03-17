const os = require('os');
const fs = require('fs');
const path = require('path');
const inspect = require('util').inspect;
const Busboy = require('busboy');
const config = require('../config');
const random = require('./random');

/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数
 * @return {promise}         
 */
function upload(ctx, options) {
  return new Promise((resolve, reject) => {
    const data = [];
    const busboy = new Busboy({headers: ctx.req.headers});
    const uploadFolder = options.uploadFolder;

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }

    // 解析请求文件事件
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      const extendName = filename.split('.').pop();
      const saveName = random();
      const saveFullname = saveName + '.' + extendName;
      const savePath = path.join(uploadFolder, saveFullname);

      // 文件保存到制定路径
      file.pipe(fs.createWriteStream(savePath));

      file.on('end', function() {
        console.log(`文件【${filename}】上传成功，存储为【${savePath}】`);
        data.push({
          panoramaId: options.id,
          name: saveName,
          img: `//${ctx.host}/upload/${options.path}/${saveFullname}`,
          thumb: `//${ctx.host}/upload/${options.path}/vtour/panos/${saveName}.tiles/thumb.jpg`,
          preview: `//${ctx.host}/upload/${options.path}/vtour/panos/${saveName}.tiles/preview.jpg`,
          cube: `//${ctx.host}/upload/${options.path}/vtour/panos/${saveName}.tiles/pano_%s.jpg`
        });
      });
    });

    // 解析结束事件
    busboy.on('finish', function() {
      resolve(data);
    });

    // 解析错误事件
    busboy.on('error', function(err) {
      reject();
    });

    ctx.req.pipe(busboy);
  });
}

module.exports = {
  upload
};