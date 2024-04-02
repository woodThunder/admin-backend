const KoaRouter = require("@koa/router");
const moment = require('moment');
const AccountRole = require("../../models/account_role");
const Role = require("../../models/role");
const { createAndUpdate } = require("../utils")

const router = new KoaRouter({
  prefix: "/account_role",
});
// TODO 查询条件，模糊查询，排序，分页
router.post("/list", async (ctx) => {
  const { pageNum = 1, pageSize = 10, account_id } = ctx.request.body;
  const searchQuery = {
    account_id: account_id,
    is_delete: 0
  };

  // 获取总条数
  const total = await AccountRole.countDocuments(searchQuery);

  let list = await AccountRole.aggregate([
    { $match: { account_id, is_delete: 0 } }, // 匹配指定的 account_id
    {
      $lookup: {
        from: 'base_role', // 要连接的集合名称，即需要从哪个集合中获取数据
        localField: 'role_id', // 本地集合中用于匹配的字段，通常是当前集合的字段
        foreignField: 'id', // 外部集合中用于匹配的字段，通常是另一个集合的字段
        as: 'role_name' // 连接查询结果存放的字段名
      }
    }, // 查询出来的是数组
    {
      $project: {
        _id: 0,
        id: 1,
        role_id: 1,
        account_id: 1,
        create_date: 1,
        create_user_id: 1,
        create_user_account: 1,
        create_user_name: 1,
        update_date: 1,
        update_user_id: 1,
        update_user_account: 1,
        update_user_name: 1,
        is_delete: 1,
        role_name: { $arrayElemAt: ['$role_name.name', 0] } // 获取角色名称
      }
    },
    {
      $sort: { create_date: -1 }
    },
    {
      $skip: pageSize * (pageNum - 1)
    },
    {
      $limit: pageSize
    }
  ])
  if (list) {
    list = list.map(item => {
      item.update_date = moment(item.update_date).format('YYYY-MM-DD HH:mm:ss')
      return item
    })
  }
  
  ctx.body = {
    success: true,
    code: 200,
    data: {
      list: list || [],
      pageNum,
      pageSize,
      total
    }
  };
});

// 取消关联
router.post('/delete', async (ctx) => {
  const params = await createAndUpdate(ctx.request.body, ctx.state.user.id, 'update')
  await AccountRole.findOneAndUpdate({id: params.id}, { $set: {is_delete: 1, ...params} });
  ctx.body = {
    code: 200,
    success: true,
    message: '取消关联成功'
  };
});

// 查找当前用户没有绑定的角色列表
router.post('/role_list', async (ctx) => {
  const { account_id, name, pageNum = 1, pageSize = 10 } = ctx.request.body;
  const searchQuery = {
    name: { $regex: name || '' },
    is_delete: 0
  };
  // 角色列表
  const roleList = await Role.find(searchQuery)
  // 当前用户关联角色列表
  const accountRoleList = await AccountRole.find({
    account_id,
    is_delete: 0
  })
  // 当前用户关联角色的角色id数组
  const accountRoleListIds = accountRoleList.map(i => i.role_id);
  // 过滤掉已经关联的角色
  const listRes = roleList.filter(role => !accountRoleListIds.includes(role.id));
  // 分页处理
  const total = listRes.length;
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = listRes.slice(startIndex, endIndex)

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

// 批量关联角色
router.post('/association_role', async (ctx) => {
  const { account_id, roleIdList } = ctx.request.body;
  const params = await createAndUpdate({ account_id }, ctx.state.user.id, 'create')
  // 验证角色ID列表是否为空
  if (!Array.isArray(roleIdList) || !roleIdList.length) {
    ctx.body = {
      success: false,
      code: 400,
      message: "角色ID列表不能为空"
    };
    return;
  }
  const data = roleIdList.map(role_id => ({
    ...params,
    role_id
  }));

  await AccountRole.insertMany(data);

  ctx.body = {
    success: true,
    code: 200,
    message: '关联成功'
  };
});

module.exports = router;
