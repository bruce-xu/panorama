const path = require('path');

module.exports = {
  /**
   * 数据库文件路径
   */
  DATABASE_FILE: path.join(__dirname, 'db/database.db'),
  
  /**
   * 上传文件目录
   */
  UPLOAD_PATH: path.join(__dirname, 'static/upload'),
}