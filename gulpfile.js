/*jslint node: true */
'use strict';

var connect = require('gulp-connect');
var copy = require('gulp-copy');
var del = require('del');
var es = require('event-stream');
var fs = require('fs');
var gulp = require('gulp');
var watch = require('gulp-watch');
var yaml = require('js-yaml');

try {
  var cfg = yaml.safeLoad(fs.readFileSync('./config.yaml', 'utf8'));
} catch (e) {
  console.log(e);
}

var pruneSrc = function (dirname) {
  dirname = dirname.split('/');
  dirname.splice(0, 1);
  dirname = dirname.join('/');
  return dirname;
};

gulp.task('clean', function (done) {
  return del([cfg.path.dist + '**/*', cfg.path.src + 'vendor/**/*'], done);
});

gulp.task('vendor', ['clean'], function (done) {
  return gulp.src('./vendor/**/*')
             .pipe(copy(cfg.path.src + 'vendor', { prefix: 1 }));
});

gulp.task('exampleModels', function () {
  return gulp.src('./node_modules/altspace/examples/models/**/*')
             .pipe(copy(cfg.path.src + 'models/examples', { prefix: 4 }));
});

gulp.task('dev', ['clean', 'vendor'], function (done) {
  var streams = [];

  streams.push(gulp.src(cfg.path.src + '/**/*')
         .pipe(copy(cfg.path.dist, { prefix: 1 })));

  streams.push(gulp.src(cfg.path.src + 'vendor/**/*')
      .pipe(copy(cfg.path.dist, { prefix: 1 }))
      .pipe(connect.reload()));

  es.merge(streams).on('end', done);
});

gulp.task('watch', ['dev'], function () {
  gulp.watch([cfg.path.src + '/**/*',
              '!' + cfg.path.src + 'vendor/**/*',
             ], ['dev']);
});

gulp.task('connect', function () {
  connect.server({
    root: [cfg.path.dist],
    port: 9000,
    livereload: true,
  });
});

gulp.task('default', ['connect', 'dev', 'watch']);
