const Database = require('../db/Database');

class PanoramaModel {
  static create(data) {
    return Database.insert(`INSERT INTO panorama (name, path, stage, create_time, update_time) VALUES (?, ?, 'init', datetime('now'), datetime('now'))`, [data.name, data.path]);
  }

  static getList() {
    return Database.queryAll(`SELECT * FROM panorama`);
  }

  static getDetail(id) {
    return Database.query(`SELECT * FROM panorama`, {id});
  }

  static del(id) {
    return Database.del(`DELETE FROM panorama WHERE id = ?`, [id]);
  }

  static update(data, query) {
    return Database.update(`UPDATE panorama`, data, query);
  }
}

module.exports = PanoramaModel;