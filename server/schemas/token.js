//将全局票据保存到数据库中
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  name: String,
  access_token: String,
  expires_in: Number
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'update_at'
  }
});

TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.created_at = this.updated_at = Date.now();
  } else {
    this.updated_at = Date.now();
  }

  next();
})

// 定义模型静态方法
TokenSchema.statics = {
  // 获取token
  async getToken() {
    const token = await this.findOne({
      name: 'access_token'
    }).exec();

    return token;
  },
  // 保存token
  async saveToken(data) {
    let token = await this.findOne({
      name: 'access_token'
    }).exec();

    console.log('data,token',data, token);
    if (token) {
      token.access_token = data.access_token;
      token.expires_in = data.expires_in;
    } else {
      token = new Token({
        name: 'access_token',
        access_token: data.access_token,
        expires_in: data.expires_in
      })

      await token.save();
      return data;
    }
  }
}
const Token = mongoose.model('Token', TokenSchema);
module.exports = {
  TokenSchema
}
