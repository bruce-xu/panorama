const Database = require('../db/Database');

class HotspotModel {
  static create(data) {
    return Database.insert(`INSERT INTO hotspot (name, type, url, ath, atv, scene_id, extra, create_time, update_time)
                            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                            [data.name, data.type, data.url, data.ath, data.atv, data.scene_id, JSON.stringify(data.extra)]);
  }

  static update(data, query) {
    return Database.update(`UPDATE hotspot`, data, query);
  }

  static getDetail(id) {
    return Database.query('SELECT * FROM hotspot', {id})
      .then((hotspot) => {
        hotspot.extra = JSON.parse(hotspot.extra);
      });
  }

  static getHotspotsByScenes(sceneIds) {
    const len = sceneIds.length;
    return Database.run('all', 'SELECT * FROM hotspot WHERE scene_id IN (' + Array(len).fill('?', 0, len).join(', ') + ')', sceneIds)
      .then((hotspots) => {
        hotspots.forEach((hotspot) => {
          hotspot.extra = JSON.parse(hotspot.extra);
        });

        return hotspots;
      });
  }

  static deleteHotspotsByScenes(sceneIds) {
    const len = sceneIds.length;
    return Database.del('DELETE FROM hotspot WHERE scene_id IN (' + Array(len).fill('?', 0, len).join(', ') + ')', sceneIds);
  }
}

module.exports = HotspotModel;