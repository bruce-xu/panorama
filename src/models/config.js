const Database = require('../db/Database');

class ConfigModel {
  static create(data) {
    return Database.insert(`INSERT INTO config (name, value, create_time, update_time) VALUES (?, ?, datetime('now'), datetime('now'))`, [data.name, data.value]);
  }

  static getConfig(name) {
    return Database.query(`SELECT * FROM config`, {name});
  }
}

module.exports = ConfigModel;