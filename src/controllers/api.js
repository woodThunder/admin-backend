const KoaRouter = require("@koa/router");
// TODO 批量引入子路由
const fs = require('fs');
const path = require('path');
// const accountRouter = require("./api/account");
// const menuRouter = require("./api/menu");
// const roleRouter = require("./api/role");
const jwt = require('jsonwebtoken');
const { tokenMap } = require("./utils/contant")

const router = new KoaRouter({
  prefix: "/api",
});

// token 校验中间件
router.use(async (ctx, next) => {
  // 不需要token的path白名单
  const pathWhiteList = ['/api/account/login']
  // 如果不在白名单
  if (!pathWhiteList.includes(ctx.request.path)) {
    const { token } = ctx.request.header
    // 如果token不存在
    if (!token) {
      ctx.body = {
        success: false,
        code: 401,
        message: 'token不存在'
      }
      return 
    }
    const user = jwt.verify(token, 'qG0QpVft4P1_u6U~ixLdspa0C,-PnR1+')
    // token不存在，token已过期，单点登录刷新token || tokenMap.get(user.id) !== token
    if (!user) {
      ctx.body = {
        success: false,
        code: 401,
        message: 'token错误'
      }
      return
    }
    if (Date.now() > user.expirt_at) {
      ctx.body = {
        success: false,
        code: 401,
        message: 'token已过期'
      }
      return
    }
    // 将解密后的数据存储在ctx，方便接口直接使用
    ctx.state.user = user
  }
  await next()
});

// TODO 批量引入子路由
// 获取子路由文件夹中所有路由模块
const routesPath = path.join(__dirname, './api');
// console.log(routesPath) // \myserver\src\controllers\api
// 返回目录中的文件名
const files = fs.readdirSync(routesPath); 
// console.log(files) // [ 'account.js', 'account_role.js', 'menu.js', 'role.js' ]
// 批量引入子路由模块
files.forEach((file) => {
  if (file.endsWith('.js')) {
    const route = require(path.join(routesPath, file));
    router.use(route.routes(), route.allowedMethods());
  }
})

// router.use(accountRouter.routes(), accountRouter.allowedMethods());
// router.use(menuRouter.routes(), menuRouter.allowedMethods());
// router.use(roleRouter.routes(), roleRouter.allowedMethods());

module.exports = router;
