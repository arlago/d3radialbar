var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('minify', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest("dist"));
});

gulp.task('copy-source', function() {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest("dist"));
});

gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default', { verbose: true }));
});

gulp.task('default', ['minify', 'copy-source']);
