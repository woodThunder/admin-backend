const { Model } = require("../mongo");

const schema = {
  id: { type: String, required: true, unique: true }, // 唯一标识
  parent_id: { type: String, default: 'root' }, // 默认根节点的parentId为'root'
  title: String,
  type: { type: Number, enum: [1, 2, 3] }, // 菜单类型：1分类菜单 2页面菜单 3按钮
  name: String,
  route_path: String,
  component_path: String,
  icon: String,
  is_keepalive: { type: Boolean, default: false },
  is_left_menu: { type: Boolean, default: true },
  level: { type: Number, default: 0 }, // 根节点的level是0
  sort: { type: Number, default: 10 },
  create_date: { type: Date},
  create_user_id: String,
  create_user_account: String,
  create_user_name: String,
  update_date: { type: Date},
  update_user_id: String,
  update_user_account: String,
  update_user_name: String,
  is_delete: { type: Number, default: 0 }, // 1删除 0正常
};

const model = Model("base_menu", schema);

module.exports = model;
