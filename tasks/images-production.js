'use strict';

import config from '../config/default';

import gulp from 'gulp';
import notify from 'gulp-notify';
//import imagemin from 'gulp-imagemin';

export default () => {

    return gulp.src( './' + config.paths.build + '/' + config.paths.assets.image, { read: false } )
        .on('end', function(){
            
            return gulp.src( './' + config.paths.source + '/images/**' )
                //.pipe(imagemin({
                //    progressive: true
                //}))
                .pipe(gulp.dest( './' + config.paths.build + '/' + config.paths.assets.image ));
        });
}
