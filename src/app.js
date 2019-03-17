const path = require('path');
const Koa = require('koa');
const views = require('koa-views');
const static = require('koa-static');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');
const router = require('./routers');
const init = require('./init');

const app = new Koa();

app.use(bodyParser({
  formLimit: '10mb'
}));

render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html'
});

app.use(static(
  path.join(__dirname,  './static')
));

app.use(router.routes());

app.listen(8001);

// 初始化数据库（如果未初始化过的话）
init();

console.log('Server is running at 8001 port.');