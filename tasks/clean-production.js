'use strict';

import config from '../config/default';

import gulp from 'gulp';
import clean from 'gulp-clean';
import notify from 'gulp-notify';

export default () => {

    return gulp.src( './' + config.paths.build, { read: false })
        .pipe(clean())
		.pipe(notify({ icon: false, onLast: true, title: 'Clean finished', message: 'Cleaned build directory: ' + config.paths.build }));

}
