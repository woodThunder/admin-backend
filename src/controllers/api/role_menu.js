const KoaRouter = require("@koa/router");
const moment = require('moment');
const RoleMenu = require("../../models/role_menu");
const Menu = require("../../models/menu");
const { createAndUpdate, convertToNested } = require("../utils")

const router = new KoaRouter({
  prefix: "/role_menu",
});
// TODO 查询条件，模糊查询，排序，分页
router.post("/list", async (ctx) => {
  const { role_id } = ctx.request.body;
  const searchQuery = {
    role_id: role_id,
    is_delete: 0
  };
  // 查询当前角色绑定的菜单
  const roleMenuList = await RoleMenu.find(searchQuery).select('menu_id')
  const roleMenuIds = roleMenuList.map(i => i.menu_id)
  // console.log(roleMenuIds)
  // 查询所有的菜单
  const menus = await Menu.find({is_delete: 0}).sort({ sort: 1 })
  // 给当前角色绑定的菜单添加标识isChoose
  const list = menus.map(menu => {
    if (roleMenuIds.includes(menu.id)) {
      menu._doc.isChoose = 1
    } else {
      menu._doc.isChoose = 0
    }
    return menu
  })
  // 转换为树形结构
  const tree = convertToNested(list)
  
  ctx.body = {
    success: true,
    code: 200,
    data: tree
  };
});

// 保存
router.post('/save', async (ctx) => {
  const { role_id, saveMenuBids, deleteMenBids } = ctx.request.body
  if (saveMenuBids.length) {
    const createParams = await createAndUpdate({}, ctx.state.user.id, 'create')
    const createList = saveMenuBids.map(menu_id => {
      return {
        menu_id,
        role_id,
        ...createParams
      }
    })
    console.log(createList)
    // 创建
    await RoleMenu.insertMany(createList)
  }
  if (deleteMenBids.length) {
    const updateParams = await createAndUpdate({}, ctx.state.user.id, 'update')// 删除
    await RoleMenu.updateMany(
      { menu_id: { $in: deleteMenBids } },
      { $set: { is_delete: 1, ...updateParams } }
    );
  }
  ctx.body = {
    code: 200,
    success: true,
    message: '保存成功'
  };
});

module.exports = router;
