const KoaRouter = require("@koa/router");
const Menu = require("../../models/menu");
const { getAllMenus, createAndUpdate } = require("../utils")
const router = new KoaRouter({
  prefix: "/menu",
});

router.post('/list', async (ctx) => {
  const data = await getAllMenus()
  ctx.body = {
    success: true,
    code: 200,
    data
  }
})

router.post('/create', async (ctx) => {
  const params = await createAndUpdate(ctx.request.body, ctx.state.user.id, 'create')
  await new Menu(params).save();
  ctx.body = {
    code: 200,
    success: true,
    message: '保存成功'
  };
})

router.post('/delete', async (ctx) => {
  const { ids } = ctx.request.body
  const params = await createAndUpdate({}, ctx.state.user.id, 'update')
  
  await Menu.updateMany(
    { id: { $in: ids } },
    { $set: { is_delete: 1, ...params } }
  );
  ctx.body = {
    code: 200,
    success: true,
    message: '删除成功'
  };
})

router.post('/update', async (ctx) => {
  const params = await createAndUpdate(ctx.request.body, ctx.state.user.id, 'update')
  await Menu.findOneAndUpdate({id: params.id}, { $set: params });
  ctx.body = {
    code: 200,
    success: true,
    message: '修改成功'
  };
});

module.exports = router;
