const cp = require('child_process');
const config = require('../config');

/**
 * 根据传入的图片生成全景漫游
 * @param {Array.<string>} filePath 文件路径
 */
function vtour(krpanoPath, filePath) {
  return new Promise((resolve, reject) => {
    const command = `'${krpanoPath}/krpanotools' makepano '${krpanoPath}/templates/vtour-normal.config' ${filePath}/*.jpg ${filePath}/*.jpeg ${filePath}/*.png`;
    console.log('Execute Krpano command: ' + command);
    cp.exec(command, {}, function(err, stdout, stderr) {
      if (err) {
        console.log('Failed to execute Krpano command, the output is: ' + stderr);
        reject();
      } else {
        console.log('Success to execute Krpano command, the output is: ' + stdout);
        resolve();
      }
    });
  });
}

module.exports = {
  vtour
};