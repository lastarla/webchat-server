var session = require('../session');
var util = require('./util');
// var message = require('../message');

var auth = function (ws, msg) {
	var userSession = session.getUserSession(msg.from);

	if (!userSession) {
		return util.send(ws, {
			success: false,
			type: 'system',
			from: msg.from,
			to: msg.to,
			reason: 1,
			message: '系统异常，请刷新页面',
		});
	}

	userSession.ws = ws;

	util.send(userSession.ws, {
		success: true,
		type: 'auth',
		from: msg.from,
		to: msg.to,
		message: '可以开始聊天了'
	});
};

var push = function (ws, msg) {
	var userSession = session.getUserSession(msg.to) || {};
	var tws = userSession.ws;

	if (!tws) {
		return util.send(ws, {
			success: false,
			type: 'system',
			from: msg.from,
			to: msg.to,
			reason: 2,
			message: '对方不在线',
		});
	}

	util.send(ws, msg);
	util.send(tws, msg);
	// message.addMsg(msg);
};

module.exports = {
	'auth': auth,
	'push': push
};
