const KoaRouter = require("@koa/router");
const Role = require("../../models/role");
const { createAndUpdate } = require("../utils")

const router = new KoaRouter({
  prefix: "/role",
});
// TODO 查询条件，模糊查询，排序，分页
router.post("/list", async (ctx) => {
  const { name, pageNum = 1, pageSize = 10 } = ctx.request.body;
  const searchQuery = {
    name: { $regex: name || '' },
    is_delete: 0
  };

  // 获取总条数
  const total = await Role.countDocuments(searchQuery);
  
  const list = await Role.find(searchQuery)
    .sort({ create_date: -1 }) // 按创建时间倒序
    .skip(pageSize * (pageNum - 1))
    .limit(pageSize);

  ctx.body = {
    success: true,
    code: 200,
    data: {
      list,
      pageNum,
      pageSize,
      total
    }
  };
});

// 创建角色
router.post('/create', async (ctx) => {
  const params = await createAndUpdate(ctx.request.body, ctx.state.user.id, 'create')
  await new Role(params).save();
  ctx.body = {
    code: 200,
    success: true,
    message: '保存成功'
  };
});

// 更新用户
router.post('/update', async (ctx) => {
  const params = await createAndUpdate(ctx.request.body, ctx.state.user.id, 'update')
  await Role.findOneAndUpdate({id: params.id}, { $set: params });
  ctx.body = {
    code: 200,
    success: true,
    message: '修改成功'
  };
});

// 删除用户
router.post('/delete', async (ctx) => {
  const params = await createAndUpdate(ctx.request.body, ctx.state.user.id, 'update')
  await Role.findOneAndUpdate({id: params.id}, { $set: {is_delete: 1, ...params} });
  ctx.body = {
    code: 200,
    success: true,
    message: '删除成功'
  };
});

module.exports = router;
