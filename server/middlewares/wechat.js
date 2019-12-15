/**
 * 微信消息中间件
 */
const sha1 = require('sha1');
const getRawBody = require('raw-body');
const util = require('../util');

const tip = `欢迎来到我的公众号小模板\n 点击 <a href="https://coding.imooc.com">一起搞事情</a>`
const replay = async (ctx, next) => {
  const message = ctx.wechat;
  ctx.body = tip;
}

const wechat = function(opts) {
  return async (ctx, next) => {
    const token = opts.token;
    const {
        signature,
        nonce,
        timestamp,
        echostr
    } = ctx.query;
    console.log('ctx.query', ctx.query);
    const str = [token, timestamp, nonce].sort().join('');
    const sha = sha1(str);
    
    if (sha === signature) {
        if (ctx.method === 'GET') {
          ctx.body = echostr;
        } else if (ctx.method === 'POST') {
          // 获取微信服务器的原始内容
          const data = await getRawBody(ctx.req, {
            length: ctx.length,
            limit: '1mb',
            encoding: ctx.charset
          });
          const content = await util.parseXML(data);
          console.log('解析后的数据为：', content);
          // const message = util.formatMessage(content.xml);
          ctx.wechat = {};

          await replay(ctx, next);
          const replayBody = ctx.body;
          const msg = ctx.wechat;
          // const xml = util.tpl(replayBody, msg);
          const xml = `<xml>
          <ToUserName><![CDATA[${content.xml.FromUserName}]]></ToUserName>
          <FromUserName><![CDATA[${content.xml.ToUserName}]]></FromUserName>
          <CreateTime>12345678</CreateTime>
          <MsgType><![CDATA[text]]></MsgType>
          <Content><![CDATA[${replayBody}]]></Content>
        </xml>`
          // 设置回复内容
          ctx.status = 200;
          ctx.type = 'application/xml';
          ctx.body = xml;
        }
    } else {
        ctx.body = 'fail';
    }
  }
}

module.exports = wechat