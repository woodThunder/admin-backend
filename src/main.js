const mongo = require("./mongo");

mongo
  .tryConnect()
  .then((_) => {
    require("./server");
  })
  .catch((err) => console.log(err));
