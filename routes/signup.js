'use strict'

var express = require('express');
var router = express.Router();

var users = require('../lib/users');



router.get('/signup', redirectIfLoggedIn, createForm);
router.post('/signup', signupHandler);

module.exports = router;

//route middlewares

function createForm(req, res, next) {
	res.render('signup', { title: 'Sign Up' });
}

function signupHandler(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	// vantar alla villumedhondlun
	users.createUser(username, password, function(err, status){
		if(err){
			console.error(err);
		}

		var success = true;

		if(err || !status){
			success = false;
		}

		
		res.render('signup', { title: 'Sign Up', post: true, success: success });
	})
	
}

function redirectIfLoggedIn(req, res, next){
	if(req.session.user){
		res.redirect('/wall');
	}
	else {
		next();
	}
	
}