var fs = require('fs');
var path = require('path');

function addRoute(router, mapping) {
	for (var url in mapping) {
		if (url.startsWith('GET ')) {
			var urlPath = url.substring(4);
			router.get(urlPath, mapping[url]);
		}
		else if (url.startsWith('POST ')) {
			var urlPath = url.substring(5);
			router.post(urlPath, mapping[url]);
		}
		else {
			console.log(`invalid url: ${url}`)
		}
	}
}

function addController(router, dir) {
	var controllersDir = path.join(__dirname, dir);
	var jsFiles = fs.readdirSync(controllersDir).filter(function (f) {
		return f.endsWith('.js');
	});

	jsFiles.map(function (f) {
		var filePath = path.join(__dirname, dir, f);
		var mapping = require(filePath);
		addRoute(router, mapping);
	});
}


module.exports = function (dir) {
	dir =  dir || 'controllers';

	var router = require('koa-router')();

	addController(router, dir);

	return router.routes();
}