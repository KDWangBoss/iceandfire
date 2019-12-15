const mongoose = require('mongoose');
const config = require('../config');
const Wechat = require('../models/wechat');

const Token = mongoose.model('Token');

const wechatConfig = {
  wechat: {
    appID: config.wechat.appID,
    appSecret: config.wechat.appSecret,
    token: config.wechat.token,
    getToken: async () => await Token.getToken(),
    saveToken: async (data) => await Token.saveToken(data)
  }
}

const getWechat = () => {
  return new Wechat(wechatConfig.wechat);
}

getWechat();

module.exports = {
  getWechat
}
