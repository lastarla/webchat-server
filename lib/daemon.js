var cp = require('child_process');

function spawn(server) {
	var worker = cp.spawn('node', [server]);

	worker.on('exit', function (code) {
		if (code !== 0) {
			spawn(server);
		}
	});
}

spawn('main.js');