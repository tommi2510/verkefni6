'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('inspect', function(){
	gulp.src(['./**/*.js', '!node_modules/**/*.js',
	 '!public/bower_components/**/*.js', '!public/semantic/**/*.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('default'));

});