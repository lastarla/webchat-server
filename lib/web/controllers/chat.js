var message = require('../../message');

var historyMsg = async (ctx, next) => {
	
	function getHistory () {
		var postData = ctx.request.body;
		var from = postData.from || '';
		var to = postData.to || '';

		if (!from || !to) {
			return {
				success: false,
				value: {
					message: '参数不能为空'
				}
			};
		}

		var list = message.getMsg(from, to);

		return {
			success: true,
			value: {
				model: list
			}
		}
	}

	ctx.response.body = getHistory();
}

module.exports = {
	'POST /api/historymsg': historyMsg
};