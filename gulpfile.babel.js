'use strict';

import config from './config/default';

import gulp from 'gulp';
import notify from 'gulp-notify';

//
// Task: Browser Sync
// 

import taskBrowserSync from './tasks/browser-sync';
gulp.task('browser-sync', taskBrowserSync);

//
// Task: Clean build
// 

import taskClean from './tasks/clean';
gulp.task('clean', taskClean);

import taskCleanProduction from './tasks/clean-production';
gulp.task('clean-production', taskCleanProduction);

//
// Pug (formely known as Jade)
//

import taskPug from './tasks/pug';
gulp.task('pug', taskPug);

import taskPugProduction from './tasks/pug-production';
gulp.task('pug-production', taskPugProduction);


//
// Task: Styles
//

import taskStyles from './tasks/styles';
gulp.task('styles', taskStyles);

import taskStylesProduction from './tasks/styles-production';
gulp.task('styles-production', taskStylesProduction);

//
// Task: Assets
//

import taskFonts from './tasks/fonts';
gulp.task('fonts', taskFonts);

import taskFontsProduction from './tasks/fonts-production';
gulp.task('fonts-production', taskFontsProduction);

import taskImages from './tasks/images';
gulp.task('images', taskImages);

import taskImagesProduction from './tasks/images-production';
gulp.task('images-production', taskImagesProduction);

//
// Task: JavaScript (compiles ES6 to ES5)
//

import taskJS from './tasks/js';
gulp.task('js', taskJS);

import taskJSProduction from './tasks/js-production';
gulp.task('js-production', ['js'], taskJSProduction);


//
//
//
//
// Default: Watch
//
//
//
//


/* 
 * Default task. 
 * Always run 'clean' first before every other task, prevents async issues when cleaning.
 */ 
gulp.task('default', ['clean'], function () {
    gulp.start(['develop']);
});

// All watch tasks for development
gulp.task('fonts-watch', ['fonts'], taskBrowserSync.reload);
gulp.task('images-watch', ['images'], function(){
    console.log('Reload please!');
    taskBrowserSync.reload;
});
gulp.task('js-watch', ['js'], taskBrowserSync.reload);
gulp.task('styles-watch', ['styles'], taskBrowserSync.reload);
gulp.task('pug-watch', ['pug'], taskBrowserSync.reload);

/* 
 * Task 'develop' runs all tasks, starts a watch for each directory and starts browser sync.
 */
gulp.task('develop', ['fonts', 'images', 'js', 'styles', 'pug'], function(){

    gulp.watch(['fonts/**/*'], {cwd: config.paths.source}, ['fonts-watch']);
    gulp.watch(['images/**/*'], {cwd: config.paths.source}, ['images-watch']);
    gulp.watch(['js/**/*.js'], {cwd: config.paths.source}, ['js-watch']);
    gulp.watch(['less/**/*.less'], {cwd: config.paths.source}, ['styles-watch']);
    gulp.watch(['pug/**/*.pug'], {cwd: config.paths.source}, ['pug-watch']);

    gulp.start('browser-sync');

});


//
//
//
//
// Production
//
//
//
//

gulp.task('build', ['clean-production'], function () {
    gulp.start('build-production');
});

gulp.task('build-production', [ 'fonts-production', 'images-production', 'styles-production', 'js-production', 'pug-production' ], function(){
    gulp.src('./' + config.paths.build)
        .pipe(notify({ icon: "icon.png"
             , onLast: true
             , sound: "Submarine"
             , title: 'Your build is ready'
             , message: 'All source files are compiled to the directory: ' + config.paths.build
         }));

});
