var sessions = {};
var COOKIE_NAME = 'sid';

var set = function (ctx, values) {
	var sid = typeof ctx === 'object' ? ctx.cookies.get(COOKIE_NAME) : ctx;

	if (!sid) {
		sid = values.userId;
	}

	sessions[sid] = sessions[sid] || {};

	if (values) {
		for (var i in values) {
			if (values.hasOwnProperty(i)) {
				sessions[sid][i] = values[i];
			}
		}
	}
}

var get = function (ctx) {
	var sid = typeof ctx === 'object' ? ctx.cookies.get(COOKIE_NAME) : ctx;

	if (sid) {
		return sessions[sid];
	}

	return sessions;
}

var destroy = function (ctx) {
	var sid = typeof ctx === 'object' ? ctx.cookies.get(COOKIE_NAME) : ctx;

	if (!sid) {
		return;
	}

	return delete sessions[sid];
}

var autoDestory = function (sid, delay) {
	setTimeout(function () {
		var session = get(sid);

		if (!sessions.login) {
			destroy(sid);
		}

	}, delay);
};

var getUserSession = function (userId) {
	var result = null;

	for (var i in sessions) {
		if (sessions.hasOwnProperty(i)) {
			if (sessions[i].userId === userId) {
				result = sessions[i];
			}
		}
	}

	return result;
}

var getUserSessions = function (userIds) {
	var result = [];

	userIds.map(function (id) {
		var userSession = getUserSession(id);

		if (userSession) {
			result.push(userSession);
		}
	});

	return result;
}

var init = function () {
	return async function (ctx, next) {

		var sid = ctx.cookies.get(COOKIE_NAME);

		if (!sid) {
			var date = new Date();
			var time = date.getTime();

			date.setDate(date.getDate() + 1);

			var expiresTime = new Date(date.getTime());
			var delay = expiresTime.getTime() - time;

			ctx.cookies.set(
		    	COOKIE_NAME,
		    	time,
				{
					domain: 'localhost',  // 写cookie所在的域名
					path: '/',       // 写cookie所在的路径
					maxAge: 10 * 60 * 1000, // cookie有效时长
					expires: expiresTime,  // cookie失效时间
					httpOnly: true,  // 是否只用于http请求中获取
					overwrite: false  // 是否允许重写
				}
		    );

			set(time);
			autoDestory(time, delay);
		}

		await next();
	}
}

module.exports = {
	init,
	set,
	get,
	destroy,
	getUserSession
}