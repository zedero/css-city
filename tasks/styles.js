'use strict';

import config from '../config/default';

import gulp from 'gulp';
import notify from 'gulp-notify';
var browserSync = require('browser-sync').create();

import sourcemaps from 'gulp-sourcemaps';
import less from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';

export default () => {
    return gulp.src('./' + config.paths.source + '/less/*.less')
        .pipe(sourcemaps.init())
            .pipe(less()).on('error', notify.onError( (error) => {
                return { icon: false, title: 'LESS ERROR ON LINE ' + error.line, message: error.message };
            }))
            .pipe(autoprefixer({ // CARE Autoprefixer slows (x5) this task down..!
                browsers: ['last 2 versions']
            }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./' + config.paths.test + '/' + config.paths.assets.css));
}
