'use strict';

import config from '../config/default';

import gulp from 'gulp';

export default () => {

    return gulp.src( './' + config.paths.source + '/fonts/**' )
        .pipe(gulp.dest( './' + config.paths.build + '/' + config.paths.assets.font ));
}
