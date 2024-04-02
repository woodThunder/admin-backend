const { Model } = require("../mongo");

const schema = {
  id: { type: String, unique: true, required: true }, // 唯一标识
  account_id: { type: String },
  role_id: { type: String },
  create_date: { type: Date },
  create_user_id: { type: String },
  create_user_account: { type: String },
  create_user_name: { type: String },
  update_date: { type: Date },
  update_user_id: { type: String },
  update_user_account: { type: String },
  update_user_name: { type: String },
  is_delete: { type: Number, default: 0 }
};

const model = Model("base_account_role", schema);

module.exports = model;
