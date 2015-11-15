'use strict';

var crypto = require('crypto');

var len = 128;
var iterations = 12000;


module.exports.hashing = function(password, salt, cb){
	if(arguments.length === 3){
		crypto.pbkdf2(password, salt, iterations, len, function(err, hash){
			cb(err, hash.toString('base64'));
		});
	}
	else {
		cb = salt;
		crypto.randomBytes(len, function(err, salt){
			if(err){
				return cb(err);
			}
			salt = salt.toString('base64');
			crypto.pbkdf2(password, salt, iterations, len, function(err, hash){
				if(err){
					return cb(err);
				}
				cb(null, salt, hash.toString('base64'));
			});
		});
	}
};




	



