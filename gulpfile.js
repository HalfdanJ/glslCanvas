'use strict';

var gulp = require('gulp');
var derequire = require('gulp-derequire');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');

var paths = {
    scripts: 'src/**/*.js'
};

// Build Javascripts
gulp.task('js', function () {
    var browserify = require('browserify');
    var shim = require('browserify-shim');
    var babelify = require('babelify');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var _ = require('underscore');


    var bundleThis = function(srcArray) {
      _.each(srcArray, function(src) {
            var bundle = browserify({
                entries: 'src/'+src+'.js',
                standalone: src,
                debug: true,
                transform: [
                    babelify.configure({ optional: ['runtime'] }),
                    shim
                ]
            });

            return bundle.bundle()
                .pipe(plumber())
                .pipe(source(src+'.js'))
                .pipe(derequire())
                .pipe(buffer())
                .pipe(gulp.dest('./build'));
      });
    };

    bundleThis(["GlslCanvas", "GlslWebVRCanvas"]);
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(paths.scripts, ['js']);
});

// Build files, do not watch
gulp.task('build', ['js']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['js', 'watch']);
