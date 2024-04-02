const { Model } = require("../mongo");

const schema = {
  name: String,
  avatar: String,
  account: String,
  password: String,
  token: String,
};

const model = Model("user", schema);

module.exports = model;
