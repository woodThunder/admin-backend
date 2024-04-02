const { Model } = require("../mongo");

const schema = {
  id: { type: String, unique: true, required: true }, // 唯一标识
  account: { type: String, required: true },
  password: { type: String},
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  create_date: { type: Date },
  create_user_id: { type: String },
  create_user_account: { type: String },
  create_user_name: { type: String },
  update_date: { type: Date },
  update_user_id: { type: String },
  update_user_account: { type: String },
  update_user_name: { type: String },
  is_delete: { type: Number, default: 0 },
  is_admin: { type: Number, default: 0 }
};

const model = Model("base_account", schema);

module.exports = model;
