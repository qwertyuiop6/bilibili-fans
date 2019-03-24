const Koa = require('koa');
const router = require('koa-router')();
const stat = require('koa-static');
const axios = require('axios');
const Crypto = require('crypto');

const app = new Koa();
app.use(stat(`${__dirname}/public`));


router.get('/jsonp', async (ctx) => {
  console.log(ctx.query);
  const res = await axios.get(ctx.query.url);
  //   console.log(res.data);
  const {
    name,
    mid,
    fans,
    face,
  } = res.data.data.card;

  // let newEtag = Crypto.createHash('md5').update(fans + '').digest('hex');
  ctx.status = 200;
  ctx.set('Etag', `${fans}`);

  if (ctx.fresh) {
    ctx.status = 304;
    return;
  }

  ctx.body = `${ctx.query.callback}({name:'${name}',mid:'${mid}',face:'${face}',fans:${fans},})`;
});

router.get('/', (ctx) => {
  ctx.redirect('./bilibili.html');
});

app.use(router.routes())
  .listen(2333);

console.log('127.0.0.1:2333 监听中');
