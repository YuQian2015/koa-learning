const validate = require('koa2-validation');
const {material} = require('../controllers');
const router = require('koa-router')();
const {validation} = require('./config');

router.get('/', validate(validation.findMaterial), async (ctx, next) => {
  let reqParams = ctx.query;
  ctx.body = await material.findMaterial(reqParams);
});

router.post('/add', validate(validation.addMaterial), async (ctx, next) => {
  let reqBody = ctx.request.body;
  ctx.body = await material.addMaterial(reqBody);
});

router.get('/:code', validate(validation.getMaterial), async (ctx, next) => {
  let reqParams = ctx.params;
  ctx.body = await material.getMaterial(reqParams);
});

module.exports = router;
