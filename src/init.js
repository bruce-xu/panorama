const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const config = require('./config');

/**
 * 初始化数据库
 */
function initDB() {
  let db = new sqlite3.Database(config.DATABASE_FILE, (err) => {
    if (err) {
      console.error('Failed to create database. The error message is: ' + err.message);
      throw err;
    }
  });

  // 创建配置表
  db.run(`CREATE TABLE IF NOT EXISTS config (
            id integer PRIMARY KEY,
            name text,
            value text,
            create_time integer,
            update_time integer
          )`, 
    (err) => {
      if (err) {
        console.error('Failed to create table "config". The error message is: ' + err.message);
        throw err;
      }
    }
  );

  // 创建全景项目表
  db.run(`CREATE TABLE IF NOT EXISTS panorama (
            id integer PRIMARY KEY,
            name text,
            path text NOT NULL,
            stage text,
            status integer DEFAULT 0,
            create_time integer,
            update_time integer
          )`, 
    (err) => {
      if (err) {
        console.error('Failed to create table "panorama". The error message is: ' + err.message);
        throw err;
      }
    }
  );

  // 创建场景表
  db.run(`CREATE TABLE IF NOT EXISTS scene (
            id integer PRIMARY KEY,
            img text,
            name text,
            fov text,
            hlookat text,
            vlookat text,
            preview text,
            thumb text,
            cube text,
            status integer DEFAULT 0,
            weight integer,
            create_time integer,
            update_time integer,
            panorama_id integer NOT NULL,
            FOREIGN KEY (panorama_id) REFERENCES panorama(id)
          )`,
    (err) => {
      if (err) {
        console.error('Failed to create table "scene". The error message is: ' + err.message);
        throw err;
      }
    }
  );

  // 创建热点表
  db.run(`CREATE TABLE IF NOT EXISTS hotspot (
            id integer PRIMARY KEY,
            name text,
            type text,
            ath text,
            atv text,
            url text,
            extra text,
            create_time integer,
            update_time integer,
            scene_id text NOT NULL,
            FOREIGN KEY (scene_id) REFERENCES scene(id)
          )`,
    (err) => {
      if (err) {
        console.error('Failed to create table "hotspot". The error message is: ' + err.message);
        throw err;
      }
    }
  );

  db.close((err) => {
    if (err) {
      console.error('Failed to close the database connection. The error message is: ' + err.message);
      throw err;
    }
  });
}

/**
 * 初始化系统
 */
function init() {
  initDB();
}

module.exports = init;