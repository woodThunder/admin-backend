const Koa = require("koa");
const KoaBodyParser = require("koa-bodyparser");
const app = new Koa();

app.use(
  KoaBodyParser({
    enableTypes: ["json", "form", "text"],
  })
);

const router = require("./controllers/api");
app.use(router.routes(), router.allowedMethods());

app.listen("6969");
