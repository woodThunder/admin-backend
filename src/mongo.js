const mongoose = require("mongoose");

const tryConnect = () => {
  return mongoose.connect(
    // 连接自己的数据库
    'mongodb://'
  );
};

const Model = (name, schema) => {
  return mongoose.model(
    name,
    new mongoose.Schema(schema, {
      collection: name,
    })
  );
};

module.exports = {
  tryConnect,
  Model,
};
