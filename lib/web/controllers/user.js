var lang = require('../config/lang');
var {query} = require('../../db');
var session = require('../../session');

var isUserOnline = function (userId) {
	var userSession = session.getUserSession(userId);

	if (userSession && userSession.login) {
		return true;
	}

	return false;
}

var getSql = function (sql, options) {
	var arr = [];

	options = options || {};

	while(options.time) {
		arr.push(' ' + options.field + ' = ? ');

		options.time--;
	}

	return sql + arr.join(options.type);
}

var signUp = async function (ctx, next) {

	var postData = ctx.request.body;
	var username = postData.username || '';
	var password = postData.password || '';
	var selectSql = 'SELECT * FROM user WHERE username = ?';
	var selectSqlParams = [username];
	var addSql = 'INSERT INTO user(username, password) VALUES(?, ?)';
	var addSqlParams = [username, password];

	async function register() {
		
		if (username === '') {
			return {
				success: false,
				value: {
					message: lang.SIGNUP.USERNAME_EMPTY
				}
			};
		}

		if (password === '') {
			return {
				success: false,
				value: {
					message: lang.SIGNUP.PASSWORD_EMPTY
				}
			};
		}
		
		var user = await query(selectSql, selectSqlParams);

		if (user && user.length) {
			return {
				success: false,
				value: {
					message: lang.SIGNUP.USERNAME_EXITS
				}
			};
		}
		else {
			var result = await query(addSql, addSqlParams);

			if (result) {
				return {
					success: true,
					value: {
						message: lang.SIGNUP.SUCCESS
					}
				};
			}
		}
	}

	ctx.response.body = await register();
}

var signIn = async (ctx, next) => {

	var postData = ctx.request.body;
	var username = postData.username || '';
	var password = postData.password || '';
	var sql = 'SELECT * FROM user WHERE username = ?';
	var value = [username];	

	async function login() {
		if (username === '') {
			return {
				success: false,
				value: {
					message: lang.SIGNIN.USERNAME_EMPTY
				}
			};
		}

		if (password === '') {
			return {
				success: false,
				value: {
					message: lang.SIGNIN.PASSWORD_EMPTY
				}
			};
		}

		var user = await query(sql, value);

		if (user && user.length) {
			var data = user[0];

			if (data.password === password) {
				session.set(ctx, {
					userId: data.id,
					login: true,
					username: username,
					password: password,
					friends: data.friends
				});

				return {
					success: true,
					value: {
						userId: data.id,
						message: lang.SIGNIN.SUCCESS
					}
				};
			}
			else {
				return {
					success: false,
					value: {
						message: lang.SIGNIN.FAIL
					}
				};
			}
		}
	}

	ctx.response.body = await login();
};

var signOut = async (ctx, next) => {

	function logout() {
		session.destroy(ctx);

		return {
			success: true,
			value: {
				message: lang.SIGNOUT.SUCCESS
			}
		}
	}

	ctx.response.body = logout();
};

var friendList = async (ctx, next) => {
	var postData = ctx.request.body;
	var userId = postData.userId;
	var getUserSql = 'SELECT * FROM user WHERE id = ?';
	var getUserValue = [userId];

	async function getFriendList() {
		if (userId === '') {
			return {
				success: false,
				value: {
					message: lang.FRIEND.USERID_EMPTH
				}
			}
		}

		var user = session.getUserSession(userId);

		if (user) {
			var friends = user.friends;
			var result = [];

			if (friends) {
				var friendIds = friends.split(',');
				var getFriendsSql = getSql('SELECT * FROM user WHERE', {
					type: 'OR',
					field: 'id',
					time: friendIds.length
				});
				var list = await query(getFriendsSql, friendIds);

				if (list && list.length) {

					list.map(function (item) {
						result.push({
							id: item.id,
							name: item.username,
							online: isUserOnline(item.id)
						});
					});
				}
			}
			
			return {
				success: true,
				value: {
					model: result
				}
			}
		}

		return {
			success: false,
			value: {
				message: '用户ID不存在'
			}
		}
	}

	ctx.response.body = await getFriendList();
}

var userAuth = async (ctx, next) => {
	function getUserAuth() {

		var userSession = session.get(ctx);

		if (userSession && userSession.login) {
			return {
				success: true,
				value: {
					login: true
				}
			}
		}

		return {
			success: false,
			value: {
				login: false
			}
		}
	}

	ctx.response.body = getUserAuth();
};

module.exports = {
	'POST /api/signup': signUp,
	'POST /api/signin': signIn,
	'POST /api/signout': signOut,
	'POST /api/friends': friendList,
	'POST /api/auth': userAuth
};