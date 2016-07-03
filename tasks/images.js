'use strict';

import config from '../config/default';

import gulp from 'gulp';

export default () => {

    return gulp.src( './' + config.paths.test + '/' + config.paths.assets.image, { read: false } )
        .on('end', function(){
            return gulp.src( './' + config.paths.source + '/images/**' )
                .pipe(gulp.dest( './' + config.paths.test + '/' + config.paths.assets.image ));
        });
}
