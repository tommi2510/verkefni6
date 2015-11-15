'use strict';

var express = require('express');
var moment = require('moment');
var router = express.Router();

var users = require('../lib/users');

router.get('/', index);
router.post('/', submitHandler);
router.get('/submit', ensureLoggedinIn, submit);
router.get('/logout', logout);

module.exports = router;

//route middlewares



function ensureLoggedinIn(req, res, next) {
  if (req.session.user) {
    next(); // köllum í næsta middleware ef við höfum notanda
  } else {
    res.render('login', {loggedin: 'You will have to be logged in to use this feature!'});
  }
}

function index(req, res, next){
	console.log(req.session.user);

		users.listPostsOnWall(function(err, all){
			if(err){
				console.log(err);
			}

			for (var i = 0; i < all.length; i++) {
				all[i].date = moment(all[i].date).fromNow();
			}

			var loggedin = false;
			if(req.session.user){
				loggedin = true;
			}

			res.render('wall', { title: 'Wall', posts: all, post: true, user: loggedin });
		});

}

function submitHandler(req, res, next){
	var text = req.body.textarea;
	var usr = req.session.user.username;

	users.createPost(usr, text, function(err, status){
		if(err){
			console.error(err);
		}

		var success = true;

		if(err || !status){
			success = false;
		}
		if(success) {
			res.redirect('/');
		}
		else {
			return err;
		}
		
	});
	
}

function submit(req, res, next){
	var loggedin = false;
			if(req.session.user){
				loggedin = true;
			}

	res.render('submit', { title: 'Submit', user: loggedin });
}

function logout(req, res, next){
	req.session.destroy(function(){
		res.redirect('/');
	});
}

