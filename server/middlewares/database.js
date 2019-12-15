const mongoose = require('mongoose');
const config = require('../config');
const fs = require('fs');
const {
  resolve
} = require('path');
const models = resolve(__dirname, '../schemas');
// 正则删选以js结尾的文件
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(models, file)));

const database = app => {
  // 设置错误可提示信息
  mongoose.set('debug', true);

  mongoose.connect(config.db.url);

  mongoose.connection.on('error', (error) => {
    console.error(error);
  });
  mongoose.connection.on('disconnection', () => {
    console.log('数据库断开连接了，将要重新连接');
    mongoose.connect(config.db);
  });
  mongoose.connection.on('open', async () => {
    console.log('连接数据库成功！');
  });
}

module.exports = {
  database
}
