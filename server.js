import http from 'http';
import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa2-cors';
import koaBody from 'koa-body';

const app = new Koa();

app.use(cors());
app.use(koaBody({ json: true }));

let nextId = 1;
let skills = [
  { id: nextId++, name: "React" },
  { id: nextId++, name: "Redux" },
  { id: nextId++, name: "Redux Thunk" },
  { id: nextId++, name: "RxJS" },
  { id: nextId++, name: "Redux Observable" },
  { id: nextId++, name: "Redux Saga" },
];

const router = new Router();

let isEven = true;
router.get('/api/search', async (ctx, next) => {
  if (Math.random() > 0.75) {
    ctx.response.status = 500;
    return;
  }
  const { q } = ctx.request.query;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const response = skills.filter(o =>
        o.name.toLowerCase().startsWith(q.toLowerCase())
      );
      ctx.response.body = response;
      resolve();
    }, isEven ? 1 * 1000 : 2 * 1000);
    isEven = !isEven;
  });
});

router.get('/', async (ctx, next) => {
  ctx.response.body = 'Сервер работает';
})

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log(`The server started on port ${port}`));

export default server;
