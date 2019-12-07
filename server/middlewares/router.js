const Router = require('koa-router');
const config = require('../config');
const sha1 = require('sha1');

const router = app => {
    const router = new Router();
    router.get('/wechat-hear', (ctx, next) => {
        const token = config.wechat.token;
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
            ctx.body = echostr;
        } else {
            ctx.body = 'fail';
        }
    });
  // router.post('/wechat-hear', (ctx, next) => {

  // });

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = {
    router
}
