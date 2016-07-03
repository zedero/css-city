'use strict';

import config from '../config/default';

import gulp from 'gulp';
import notify from 'gulp-notify';

import less from 'gulp-less';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';

export default () => {
    
    return gulp.src('./' + config.paths.source + '/less/*.less')
        .pipe(less()).on('error', notify.onError( (error) => {
            return { icon: false, title: 'CSS ERROR ON LINE ' + error.line, message:error.message };
        }))
        .pipe(autoprefixer({ // CARE Autoprefixer slows this task down..!
            browsers: ['last 2 versions']
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./' + config.paths.build + '/' + config.paths.assets.css));
}
