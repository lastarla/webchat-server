var WebSocket = require('ws');
var config = require('./config');
var controller = require('./controller');
var util = require('./util');

function route(ws, message) {
	message = JSON.parse(message);

	if (!message.type) {
		message.type = 'system';
		message.success = false;

		return util.send(ws, message);
	}

	for (var i in controller) {
		if (message.type === i) {
			controller[i](ws, message);
		}
	}
}

function init() {
	var wss = new WebSocket.Server({
		port: config.port
	});

	wss.on('connection', function (ws) {
		ws.on('message', function (message) {
			route(ws, message);
		});
		ws.on('error', function (err) {
			console.log(err)
		});
	});
}

module.exports = {
	init
};