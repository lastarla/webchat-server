var mysql = require('mysql');
var config = require('./config');

var pool = mysql.createPool(config);

var query = function (sql, value) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) {
				reject(err);
			}
			else {
				connection.query(sql, value, function (err, result) {
					if (err) {
						reject(err);
					}
					else {
						resolve(result);
					}

					connection.release();
				});
			}
		});
	});
}

module.exports = {
	query
}

