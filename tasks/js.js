'use strict';

import config from '../config/default';

import gulp from 'gulp';
import notify from 'gulp-notify';

import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
//import uglify from 'gulp-uglify';

export default () => {

    return gulp.src([
        './' + config.paths.source + '/js/lib/**/*.js',     // load libraries first
        './' + config.paths.source + '/js/default/**/*.js'
        ]).pipe( sourcemaps.init() )
            .pipe(babel({
                presets: ['es2015']
            }))
            .on('error', notify.onError(function (error) {
                var title = 'JS ERROR ON LINE ' + error.loc.line;
                var message = error.message.replace(/(.\.js:)( .)/,"$1\n$2");

                return { icon: false, title: title, message:message };
            }))
            .pipe(concat('all.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./' + config.paths.test + '/' + config.paths.assets.js));
}
