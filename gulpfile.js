var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    exec = require('child_process').exec,
    jshint = require('gulp-jshint');

gulp.task('default', ['watch']);

gulp.task('watch', function () {
 gulp.watch('./src/public/js/**/*.js', ['jshint']);
});

gulp.task('jshint', function() {
  return gulp.src('./src/public/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
