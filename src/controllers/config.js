const ConfigModel = require('../models/config');

function getKrpanoPath() {
  return ConfigModel.getConfig('krpano_path');
}

function saveKrpanoPath(path) {
  return ConfigModel.create({
    name: 'krpano_path',
    value: path
  });
}

module.exports = {
  getKrpanoPath,
  saveKrpanoPath
};