const request = require('request-promise');

const base = 'https://api.weixin.qq.com/cgi-bin/';
let api = {
  accessTokenUrl: base + 'token?grant_type=client_credential'
}

module.exports = class WeChatModel {

  constructor(opts) {
    this.opts = Object.assign({}, opts);
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getToken = opts.getToken;
    this.saveToken = opts.saveToken;

    // 首次进来的时候获取token
    this.fetchToken();
  }
  /**
   * 获取access_token
   */
  async fetchToken() {
    // 从文件读取token、或者从数据库读取token。。。
    let data = await this.getToken();
    console.log('从数据库中获取到的token：', data);
    if (!this.isValidateToken(data)) {
      data = await this.updateToken();
    }

    await this.saveToken(data);

    return data;
  }

  /**
   * 更新access_token
   */
  async updateToken() {
    const url = api.accessTokenUrl + '&appid=' + this.appID + '&secret=' + this.appSecret;
    const data = await this.request({
      url
    });
    console.log('获取到的token数据为：', data);
    const expires_in = Date.now() + (data.expires_in - 20) * 1000;

    data.expires_in = expires_in;
    return data;
  }

  /**
   * 验证是否过期
   */
  isValidateToken(data) {
    if (!data || !data.access_token || !data.expires_in) {
      return false;
    }

    const expires_in = data.expires_in;
    const now = Date.now();

    if (now < expires_in) {
      return true;
    } else {
      return false;
    }
  }

  async request(opts) {
    opts = Object.assign({}, opts, {
      json: true
    });
    try {
      return await request(opts);
    } catch (error) {
      console.error(error);
    }
  }
}
