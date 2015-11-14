'use strict'

var express = require('express');
var router = express.Router();

var users = require('../lib/users');


router.get('/login', redirectIfLoggedIn, login);
router.post('/login', loginHandler);

module.exports = router;

//route middlewares

function redirectIfLoggedIn(req, res, next){
	if(req.session.user){
		res.redirect('/wall');
	}
	else {
		next();
	}
	
}

function login(req, res, next){
	res.render('login', { title: 'Login' });
}

function loginHandler(req, res, next){
	var username = req.body.username;
	var password = req.body.password;

	users.auth(username, password, function(err, user){
		console.log('hello this is the loginHandler speakin!');
		if(user){
			req.session.regenerate(function(){
				req.session.user = user;
				res.redirect('/wall');
			});
		}
		else {
			var data = {
				title: 'Login',
				username: username,
				error: true
			};
			res.render('login', data);
		}	
	});
}