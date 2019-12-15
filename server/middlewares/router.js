/**
 * 路由中间件
 */
const Router = require('koa-router');
const wechat = require('./wechat');
const config = require('../config');

const router = app => {
    const router = new Router();
    router.all('/wechat-hear', wechat(config.wechat));

    app
        .use(router.routes())
        .use(router.allowedMethods());
}

module.exports = {
    router
}