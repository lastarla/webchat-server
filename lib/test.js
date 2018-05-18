var axios = require('axios');
var WebSocket = require('ws');
var webUrl = 'http://localhost:3000/';

exports.testSignUp = function () {
	axios.post(webUrl + 'signup', {
		username: 'test2',
		password: '123'
	}).then(function (res) {
		console.log(res.data);
	})
	.catch(function (err) {
		console.log(err.message);
	})
}

exports.testFriends = function () {
	axios.post(webUrl + 'friends', {
		userId: '1'
	}).then(function (res) {
		console.log(res.data);
	})
	.catch(function (err) {
		console.log(err.message);
	})
}

exports.testSignIn = function (username, password) {
	axios.post(webUrl + 'signin', {
		username: username,
		password: password
	}).then(function (res) {
		console.log(res.data.value)
		exports.createWs(res.data.value.userId)
	})
	.catch(function (err) {
		console.log(err.message);
	})
}

exports.createWs = function (userId) {
	var ws = new WebSocket('ws://localhost:3001/');

	ws.addEventListener('open', function (event) {
		var message = JSON.stringify({
			type: 'auth',
			from: userId,
			to: ''
		});
		ws.send(message);

		if (userId === 2) {
			ws.send(JSON.stringify({
				type: 'push',
				from: 2,
				to: 1,
				msg: 'Hello test'
			}));
		}
	});

	ws.addEventListener('message', function (event) {
		var data = JSON.parse(event.data);

		if (data.from && data.type === 'push') {
			if (data.from === userId) {
				console.log(data.msg);
			}
			else {
				console.log(data.msg);
			}
		}
	});
}

exports.testIm = function () {
	var users = [
		{
			username: 'test',
			password: '123'
		},
		{
			username: 'aaa',
			password: '111'
		}
	];

	users.map(function (item) {
		exports.testSignIn(item.username, item.password);
	});
}

exports.testAll = function () {
	
}

