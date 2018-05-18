var send = (ws, options) => {
	if (ws.readyState === ws.OPEN) {
		ws.send(JSON.stringify(options), (err) => {
			if (err) {
				console.log(err);
			}
		});
	}
}

module.exports = {
	send
};