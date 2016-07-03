'use strict';

import config from '../config/default';

import gulp from 'gulp';
import notify from 'gulp-notify';
import clean from 'gulp-clean';

export default () => {

    return gulp.src( './' + config.paths.test + '/' + config.paths.assets.font, { read: false } )
        .on('end', () => {
            return gulp.src( './' + config.paths.source + '/fonts/**' )
                .pipe(gulp.dest( './' + config.paths.test + '/' + config.paths.assets.font ));
        });
}
