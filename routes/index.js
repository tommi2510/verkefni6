'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', getIndex);

module.exports = router;

function getIndex(req, res, next) {
  res.render('index', { title: 'Express' });
}