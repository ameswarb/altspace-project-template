/*jslint node: true */
'use strict';

var browserify = require('browserify');
var connect = require('gulp-connect');
var copy = require('gulp-copy');
var del = require('del');
var es = require('event-stream');
var fs = require('fs');
var glob = require('glob');
var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var watch = require('gulp-watch');
var yaml = require('js-yaml');

var filelog = require('gulp-filelog');

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
  var streams = [];

  streams.push(gulp.src('./node_modules/altspace/dist/altspace.min.js')
         .pipe(copy(cfg.path.src + 'vendor/altspace', { prefix: 3 })));

  streams.push(gulp.src('./node_modules/altspace/lib/*')
         .pipe(copy(cfg.path.src + 'vendor/altspace', { prefix: 2 })));

  streams.push(gulp.src('./node_modules/altspace/src/utilities/**/*')
         .pipe(copy(cfg.path.src + 'vendor/altspace', { prefix: 3 })));

  streams.push(gulp.src('./vendor/**/*')
         .pipe(copy(cfg.path.src + 'vendor/altspace', { prefix: 2 })));

  es.merge(streams).on('end', done);
});

gulp.task('exampleModels', function () {
  return gulp.src('./node_modules/altspace/examples/models/**/*')
             .pipe(copy(cfg.path.src + 'models/examples', { prefix: 4 }));
});

gulp.task('browserify', ['clean', 'vendor'], function (done) {
  glob(cfg.path.src + 'scripts/*.js', function (err, files) {
    if (err) done(err);

    var tasks = files.map(function (entry) {
      return browserify({ entries: [entry] })
        .bundle()
        .pipe(source(entry))
        .pipe(rename(function (path) {
          path.dirname = pruneSrc(path.dirname);
          path.extname = '.bundle' + path.extname;
          return path;
        }))
        .pipe(gulp.dest(cfg.path.dist));
    });

    es.merge(tasks).on('end', done);
  });
});

gulp.task('dev', ['clean', 'browserify'], function (done) {
  var streams = [];

  streams.push(gulp.src([cfg.path.src + '/**/*',
            '!' + cfg.path.src + '/**/*.js',
           ])
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

// gulp.task('connect:reload', ['dev'], function (event) {
//   return gulp.src(cfg.path.dist + '*.html')
//              .pipe(connect.reload());
// });

gulp.task('default', ['connect', 'dev', 'watch']);
