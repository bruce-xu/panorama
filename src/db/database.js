const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

class Database {

  /**
   * 执行sql语句
   * @param {string} method 执行sql的方法
   * @param {string} sql SELECT sql语句
   * @param {Array} params sql语句中参数值数组
   * @return {Promise} Promise对象
   */
  static run(method, sql, params, type) {
    return new Promise((resolve, reject) => {
      let db = new sqlite3.Database(config.DATABASE_FILE, (err) => {
        if (err) {
          console.error('Failed to create the database connection. The error message is: ' + err.message);
          reject(err);
        }
      });

      console.log(`Execute sql: "${sql}" with params "${params}"`);
      db[method](sql, params && params.length ? params : [], function (err, data) {
        if (err) {
          console.error('Failed to execute sql statement. The error message is: ' + err.message);
          return reject(err);
        }

        if (type === 'insert') {
          resolve(this.lastID);
        } else {
          resolve(data);
        }
      });

      db.close((err) => {
        if (err) {
          console.error('Failed to close the database connection. The error message is: ' + err.message);
        }
      });
    });
  }

  /**
   * 查询单条数据
   * @param {string} sql SELECT sql语句
   * @param {Object} query 查询条件对象
   * @return {Promise} Promise对象
   */
  static query(sql, query) {
    let params = [];

    if (query) {
      const keys = Object.keys(query).map((key) => `${key} = ?`);
      params = Object.values(query);
      sql += ` WHERE ${keys.join(', ')}`;
    }

    return this.run('get', sql, params);
  }

  /**
   * 查询多条数据
   * @param {string} sql SELECT sql语句
   * @param {Object} query 查询条件对象
   * @param {boolean} noLimit 是否不限制查询数目（默认限制100条）
   * @return {Promise} Promise对象
   */
  static queryAll(sql, query, noLimit = false) {
    let params = [];

    if (query) {
      const keys = Object.keys(query).map((key) => `${key} = ?`);
      params = Object.values(query);
      sql += ` WHERE ${keys.join(', ')}`;
    }

    if (!noLimit && !/LIMIT/i.test(sql)) {
      sql += ' LIMIT 0, 100';
    }

    return this.run('all', sql, params);
  }

  /**
   * 插入数据
   * @param {string} sql Insert sql语句
   * @param {Array} params sql语句中参数值数组
   * @return {Promise} Promise对象
   */
  static insert(sql, params) {
    return this.run('run', sql, params, 'insert');
  }

  /**
   * 更新数据的高级用法
   * @param {string} sql Update sql语句
   * @param {Object} data 待更新的数据对象
   * @param {Object} query 查询条件对象
   * @return {Promise} Promise对象
   */
  static update(sql, data, query) {
    let values = [];

    if (data instanceof Array) {
      values = data;
    } else {
      const newData = [];
      for (let key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined) {
          newData[key] = data[key];
        }
      }
      const setKeys = Object.keys(newData).map((key) => `${key} = ?`);
      setKeys.push(`update_time = datetime('now')`);
      values = values.concat(Object.values(newData));
      sql += ` SET ${setKeys.join(', ')}`;
    }
    
    if (query) {
      const whereKeys = Object.keys(query).map((key) => `${key} = ?`);
      values = values.concat(Object.values(query));
      sql += ` WHERE ${whereKeys.join(', ')}`;
    }
    
    return this.run('run', sql, values, 'update');
  }

  /**
   * 删除数据
   * @param {string} sql Delete sql语句
   * @param {Array} params sql语句中参数值数组
   * @return {Promise} Promise对象
   */
  static del(sql, params) {
    return this.run('run', sql, params);
  }
}

module.exports = Database;