'use strict';
var hash = require('./password-hash').hashing;
var pg = require('pg');

var Database = process.env.DATABASE_URL;

function createUserWithHashAndSalt(username, salt, hash, cb){
	pg.connect(Database, function(error, client, done){
		if(error){
			return cb(error);
		}

		var values = [username, salt, hash, new Date()];
		var query = 'INSERT INTO Users(username, salt, hash, date) VALUES($1, $2, $3, $4)';
		client.query(query, values, function(err, result){
			done();

			if(err){
				return cb(err);
			}
			else{
				return cb(null, true);
			}

		});
	});
}

function findUser(username, cb){
	pg.connect(Database, function(error, client, done){
		if(error){
			return cb(error);
		}

		var values = [username];
		var query = 'SELECT username, salt, hash FROM Users WHERE username = $1';
		client.query(query, values, function(err, result){
			done();

			if(err){
				console.log(err);
				return cb(err);
			}
			else{
				return cb(null, result.rows);
			}

		});
	});
}

module.exports.createPost = function(username, text, cb){
	pg.connect(Database, function(error, client, done){
		if(error){
			return cb(error);
		}

		var values = [username, text, new Date()];
		var query = 'INSERT INTO Wall(owner, text, date) VALUES($1, $2, $3)';
		client.query(query, values, function(err, result){
			done();

			if(err){
				console.log(err);
				return cb(err);
			}
			else{
				return cb(null, true);
			}

		});
	});
};

module.exports.listPostsOnWall = function(cb){
	pg.connect(Database, function(error, client, done){
		if(error){
			return cb(error);
		}

		var query = 'SELECT owner, text, date FROM Wall ORDER BY date DESC LIMIT 20';
		client.query(query, function(err, result){
			done();

			if(err){
				return cb(err);
			}
			else{
				return cb(null, result.rows);
			}

		});
	});
};

module.exports.createUser = function(username, password, cb){
	hash(password, function(err, salt, hash){
		if(err){
			return cb(err);
		}

	createUserWithHashAndSalt(username, salt, hash, cb);

	});
};

module.exports.auth = function(username, password, fn){
	findUser(username, function(err, result){
		var user = null;

		if(result.length === 1){
			user = result[0];
		}
		if(!user){
			return fn(new Error('Cannot find user'));
		}

		hash(password, user.salt, function(err, hash){
			if(err){
				return fn(err);
			}
			if(hash === user.hash){
				return fn(null, user);
			}
			fn(new Error('Invalid password'));

		});
	});
};


