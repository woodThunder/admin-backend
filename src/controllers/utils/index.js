const Menu = require("../../models/menu");
const Account = require("../../models/account");
const { v4: uuidv4 } = require('uuid');
// 获取所有菜单
async function getAllMenus() {
  // const pipeline = [
  //   {
  //     $match: { parent_id: 'root', is_delete: 0 } // 假设根节点的parent_id为'root'
  //   },
  //   {
  //     $graphLookup: {
  //       from: 'base_menu', // 当前集合
  //       startWith: '$id', // 递归开始条件
  //       connectFromField: 'id', // 连接字段
  //       connectToField: 'parent_id', // 连接目标字段
  //       as: 'children' // 输出字段名
  //     }
  //   },
  //   {
  //     $sort: { sort: 1 } // 排序
  //   }
  // ];

  // // 使用聚合查询来获取嵌套的菜单列表
  // return await Menu.aggregate(pipeline);
  const menus = await Menu.find({is_delete: 0}).sort({ sort: 1 }) 
  
  // 将函数应用于菜单数据
  return convertToNested(menus);
}

// 将平铺数据转换为嵌套结构
function convertToNested(flatData) {
  const nestedData = [];
  
  // 创建一个对象，以菜单项的ID作为键，方便后续快速查找
  const menuMap = {};
  flatData.forEach(item => {
    menuMap[item._doc.id] = { ...item._doc, children: [], buttons: [] };
  });

  // 将每个菜单项放入对应的父级菜单的children数组中
  flatData.forEach(item => {
    if (item._doc.parent_id !== 'root') {
      if (menuMap[item._doc.parent_id]) {
        if (item._doc.type === 2) {
          menuMap[item._doc.parent_id].children.push(menuMap[item._doc.id]);
        } else if (item._doc.type === 3) {
          menuMap[item._doc.parent_id].buttons.push(menuMap[item._doc.id]);
        }
      }
    } else {
      nestedData.push(menuMap[item._doc.id]);
    }
  });
  // console.log(nestedData)
  return nestedData;
}

// 创建添加id和创建人id，创建时间，创建人账号，创建人姓名
// 更新时间，更新人账号，更新人姓名
async function createAndUpdate(params, currentId, type) {
  const currentInfo = await Account.findOne({ id: currentId }).lean();
  if (type === 'create') {
    params.id = uuidv4()
    params.create_date = Date.now()
    params.create_user_id = currentInfo.id
    params.create_user_account = currentInfo.account
    params.create_user_name = currentInfo.name
    params.update_date = Date.now()
    params.update_user_id = currentInfo.id
    params.update_user_account = currentInfo.account
    params.update_user_name = currentInfo.name
  } else if (type === 'update') {
    params.update_date = Date.now()
    params.update_user_id = currentInfo.id
    params.update_user_account = currentInfo.account
    params.update_user_name = currentInfo.name
  }
  return params
}

module.exports = {
  getAllMenus,
  createAndUpdate,
  convertToNested
};