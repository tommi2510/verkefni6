'use strict'

var express = require('express');
var moment = require('moment');
var router = express.Router();

var users = require('../lib/users');

router.get('/wall', index);
router.post('/wall', submitHandler);
router.get('/submit', ensureLoggedinIn, submit);
router.get('/logout', logout);

module.exports = router;

//route middlewares



function ensureLoggedinIn(req, res, next) {
  if (req.session.user) {
    next(); // köllum í næsta middleware ef við höfum notanda
  } else {
    res.redirect('/login');
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
			};

			res.render('wall', { title: 'Wall', posts: all, post: true, user: req.session.user });
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
			res.redirect('/wall');
		}
		else {
			return err;
		}
		
	});
	
}

function submit(req, res, next){
	res.render('submit', { title: 'Submit' });
}

function logout(req, res, next){
	req.session.destroy(function(){
		res.redirect('/');
	});
}

