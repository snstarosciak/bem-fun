var gulp               = require('gulp');
var fs                 = require('fs');
var es                 = require('event-stream');
var path               = require('path');
var uglify             = require('gulp-uglify');
var sass               = require('gulp-sass');
var cssmin             = require('gulp-minify-css');
var rename             = require('gulp-rename');
var autoprefixer       = require('gulp-autoprefixer');
var include            = require('gulp-include');
var notify             = require("gulp-notify");
var imagemin           = require("gulp-imagemin");
var livereload         = require('gulp-livereload');
var sourcemaps         = require('gulp-sourcemaps');
var server             = require('gulp-server-livereload');

var srcPath            = 'src/';            // Path to the source files
var distPath           = 'dist/';            // Path to the distribution files

// Paths that gulp should watch
var watchPaths        = {
    scripts:     [
        srcPath+'js/*.js',
        srcPath+'js/**/*.js'
    ],
    images:     [
        srcPath+'images/**'
    ],
    sass:         [
        srcPath+'scss/*.scss',
        srcPath+'scss/**/*.scss'
    ],
    fonts:      [
        srcPath+'fonts/**'
    ],
    html:          [
        srcPath+'**/*.html',
    ]
};

// Task for sass files
gulp.task('sass', function () {
    gulp
        .src(srcPath + 'scss/*.scss')
        .pipe(include())
        .pipe(sass())
        .on("error", notify.onError({ message: "Error: <%= error.message %>", title: "Error running sass task" }))
        .pipe(autoprefixer({ browsers: ['> 1%', 'last 2 versions'], cascade: false }))
        .on("error", notify.onError({ message: "Error: <%= error.message %>", title: "Error running sass task" }))
        .pipe(cssmin({ keepBreaks: false }))
        .on("error", notify.onError({ message: "Error: <%= error.message %>", title: "Error running sass task" }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(distPath + 'css'));
});

// Javscript task
gulp.task('scripts', function(){
    gulp
        .src(srcPath + 'js/*.js')
        .pipe(include())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .on("error", notify.onError({ message: "Error: <%= error.message %>", title: "Error running scripts task" }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(distPath + 'js'));
});

// Font task
gulp.task('fonts', function () {
    gulp
        .src([srcPath + 'fonts/**'])
        .pipe(gulp.dest(distPath + 'fonts'));
});

// HTML task
gulp.task('html', function () {
    gulp
        .src([srcPath + '*.html'])
        .pipe(include())
        .on("error", notify.onError({ message: "Error: <%= error.message %>", title: "Error running html task" }))
        .pipe(gulp.dest(distPath));
});

// Images task
gulp.task('images', function () {
    gulp
        .src(srcPath + 'images/**')
        .pipe(imagemin())
        .on("error", notify.onError({ message: "Error: <%= error.message %>", title: "Error running image task" }))
        .pipe(gulp.dest(distPath + 'images'));
});

// Watch task
gulp.task('watch', function() {
    gulp.watch(watchPaths.scripts, ['scripts']);
    gulp.watch(watchPaths.images, ['images']);
    gulp.watch(watchPaths.sass, ['sass']);
    gulp.watch(watchPaths.html, ['html']);
    gulp.watch(watchPaths.fonts, ['fonts']);

    gulp.watch(distPath + '**').on('change', livereload.changed);
});

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true,
      port: 1337
    }));
});

// Default task
gulp.task('default', ['scripts', 'images', 'sass', 'fonts', 'html', 'webserver', 'watch']);
