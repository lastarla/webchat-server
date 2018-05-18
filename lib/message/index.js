var messages = {};

var getMsg = function (from, to) {
	var key = [from, to].join(',');

	if (messages[key]) {
		return messages[key];
	}

	key = [to, from].join(',');

	if (messages[key]) {
		return messages[key];
	}

	messages[key] = [];

	return messages[key];
};

var addMsg = function (msg) {
	var message = getMsg(msg.from, msg.to);

	messages.push(msg);
}

module.exports = {
	addMsg,
	getMsg
};