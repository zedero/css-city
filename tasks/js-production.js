'use strict';

import config from '../config/default';

import gulp from 'gulp';
import uglify from 'gulp-uglify';

export default () => {

    // Please remember, this task relies on the `js` task being done first!
    return gulp.src( './'+ config.paths.test + '/' + config.paths.assets.js + '/**' )
        .pipe(uglify())
        .pipe(gulp.dest( './' + config.paths.build + '/' + config.paths.assets.js ));
}
