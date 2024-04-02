const KoaRouter = require("@koa/router");
const jwt = require("jsonwebtoken");
const Account = require("../../models/account");
const AccountRole = require("../../models/account_role");
const RoleMenu = require("../../models/role_menu");
const Menu = require("../../models/menu");
const Role = require("../../models/role");
const { getAllMenus, createAndUpdate, convertToNested } = require("../utils")
const { tokenMap } = require("../utils/contant")

const router = new KoaRouter({
  prefix: "/account",
});
// TODO 查询条件，模糊查询，排序，分页
router.post("/list", async (ctx) => {
  const { account, name, phone, pageNum = 1, pageSize = 10 } = ctx.request.body;
  const searchQuery = {
    account: { $regex: account || '' },
    name: { $regex: name || '' },
    phone: { $regex: phone || '' },
    is_delete: 0
  };

  // 获取总条数
  const total = await Account.countDocuments(searchQuery);
  
  const list = await Account.find(searchQuery)
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

// 创建新用户
router.post('/create', async (ctx) => {
  const params = await createAndUpdate(ctx.request.body, ctx.state.user.id, 'create')
  params.password = '123456'
  await new Account(params).save();
  ctx.body = {
    code: 200,
    success: true,
    message: '保存成功'
  };
});

// 更新用户
router.post('/update', async (ctx) => {
  const params = await createAndUpdate(ctx.request.body, ctx.state.user.id, 'update')
  await Account.findOneAndUpdate({id: params.id}, { $set: params });
  ctx.body = {
    code: 200,
    success: true,
    message: '修改成功'
  };
});

// 删除用户
router.post('/delete', async (ctx) => {
  const params = await createAndUpdate(ctx.request.body, ctx.state.user.id, 'update')
  await Account.findOneAndUpdate({id: params.id}, { $set: {is_delete: 1, ...params} });
  ctx.body = {
    code: 200,
    success: true,
    message: '删除成功'
  };
});

// 登录接口
router.post("/login", async (ctx) => {
  // 获取用户登录账户和密码
  const { account, password } = ctx.request.body;

  const user = await Account.findOne({ account, password }).lean();
  // console.log(user)
  if (user) {
    // 设置token
    const token = jwt.sign(
      {
        id: user.id,
        expirt_at: Date.now() + 1000 * 60 * 60 * 2,
      },
      "qG0QpVft4P1_u6U~ixLdspa0C,-PnR1+"
    );
    tokenMap.set(user.id, token)
    console.log(tokenMap)
    let menus = []
    if (user.is_admin) {
      // 如果当前账号是管理员，需要所有菜单权限
      menus = await getAllMenus()
      ctx.body = {
        code: 200,
        success: true,
        data: {
          token,
          menus,
          user
        }
      };
    } else {
      // 如果当前账号不是管理员，通过角色查找配置的菜单权限
      // 1、查询当前用户绑定的角色
      const accountRoleList = await AccountRole.find({
        account_id: user.id,
        is_delete: 0
      }).select('role_id')
      const accountRoleIds = accountRoleList.map(i => i.role_id)
      // 2、过滤掉已删除的角色
      const roleIdsRes = await Role.find({
        is_delete: 0,
        id: {$in: accountRoleIds}
      }).select('id')
      const roleIds = roleIdsRes.map(i => i.id)

      // 3、查询角色绑定的菜单
      const roleMenuList = await RoleMenu.find({
        role_id: {$in: roleIds},
        is_delete: 0
      }).select('menu_id')

      const roleMenuIds = roleMenuList.map(i => i.menu_id)

      // 查询所有的菜单
      const menus = await Menu.find({
        is_delete: 0,
        id: {$in: roleMenuIds}
      }).sort({ sort: 1 })
      
      if (!menus.length) {
        ctx.body = {
          code: 400,
          success: false,
          message: '当前用户没有菜单权限，请联系管理员'
        };
        return 
      }

      // 转换为树形结构
      const tree = convertToNested(menus)
      
      ctx.body = {
        success: true,
        code: 200,
        data: {
          token,
          menus: tree,
          user
        }
      };
    }
    
  } else {
    ctx.body = {
      code: 50001001,
      success: false,
      message: "账号或密码错误",
    };
  }
});

module.exports = router;
