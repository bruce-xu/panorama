const Database = require('../db/Database');

class SceneModel {
  static insert(data) {
    return Database.insert(`INSERT INTO scene (panorama_id, img, name, fov, hlookat, vlookat, preview, thumb, cube, weight, create_time, update_time)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                            [data.panoramaId, data.img, data.name, '0', '0', '0', data.preview, data.thumb, data.cube, 0]);
  }

  static batchInsert(data) {
    let valuesStr = '';
    let values = [];

    valuesStr = data.map((item) => {
      return `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;
    }).join(', ');
    data.forEach((item) => {
      values = values.concat([item.panoramaId, item.img, item.name, '0', '0', '0', item.preview, item.thumb, item.cube, 0]);
    });

    return Database.insert(`INSERT INTO scene (panorama_id, img, name, fov, hlookat, vlookat, preview, thumb, cube, weight, create_time, update_time)
                            VALUES ${valuesStr}`,
                            values);
  }

  static update(data, query) {

  }


  static getDetail(id) {
    return Database.query('SELECT * FROM scene', {id});
  }

  static getList(query) {
    return Database.queryAll('SELECT * FROM scene', query);
  }

  static getScenesByPanorama(panoramaId) {
    return Database.queryAll('SELECT * FROM scene', {panorama_id: panoramaId});
  }

  static deleteScenesByPanorama(panoramaId) {
    return Database.del('DELETE FROM scene WHERE panorama_id = ?', [panoramaId]);
  }
}

module.exports = SceneModel;