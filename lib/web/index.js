var path = require('path');
var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var static = require('koa-static');
var config = require('./config/config');
var controller = require('./controller');
var session = require('../session');

function init() {
	var app = new Koa();

	app.use(async (ctx, next) => {
		console.log(`Process ${ctx.request.method} ${ctx.request.url}`)
	    await next();
	});

	app.use(session.init());

	app.use(static(path.join(__dirname, config.staticPath)));

	app.use(bodyParser());

	app.use(controller());

	app.listen(config.port);
}

exports.init = init;