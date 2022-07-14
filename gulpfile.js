'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemap = require('gulp-sourcemaps');
var sass = require('gulp-sass')(require('sass'));
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var server = require('browser-sync').create();
var ghPages = require('gulp-gh-pages');

gulp.task('scss', function () {
  return gulp
    .src('app/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('html', function () {
  return gulp.src('app/*.html').pipe(gulp.dest('build'));
});

gulp.task('images', function () {
  return gulp.src('app/img/**/*.{png,jpg,svg}').pipe(gulp.dest('build/img'));
});

gulp.task('fonts', function () {
  return gulp
    .src('app/fonts/**/*.{otf,ttf,woff,woff2}')
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('app/sass/**/*.{scss,sass}', gulp.series('scss'));
  gulp.watch('app/*.html', gulp.series('html', 'refresh'));
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});
gulp.task('deploy', function () {
  return gulp.src('./build/**/*').pipe(ghPages());
});

gulp.task('build', gulp.series('scss', 'html', 'images', 'fonts'));
gulp.task('start', gulp.series('build', 'server'));
