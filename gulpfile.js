const gulp = require('gulp');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const cssnano = require('gulp-cssnano');


function scss() {
  return gulp.src('src/styles/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({
    errorLogToConsole: true,
		outputStyle: 'compressed'
  }))
  .on('error', console.error.bind(console))
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(csso())
  .pipe(concat('style.min.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/css'));
}

function pug2html(){
  return gulp.src('src/pages/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .on('error', console.error.bind(console))
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('dist'))
}

function js(){
  return gulp.src('src/js/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
}

function scripts(){
  return gulp.src('src/libs/**/*.js')
  .pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));
}

function styles(){
  return gulp.src('src/libs/**/*.css')
  .pipe(concat('libs.min.css'))
  .pipe(cssnano())
	.pipe(gulp.dest('dist/css'));
}

function image() {
  return gulp.src('src/img/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('src/img'))
    .pipe(gulp.dest('dist/img'))
}

function imgWebp(){
  return gulp.src(['dist/img/**/*.png', 'dist/img/**/*.jpg'])
   .pipe(webp({
     quality: 100
   }))
   .pipe(gulp.dest('src/img'))
   .pipe(gulp.dest('dist/img/'))
}

function imgToDist(){
  return gulp.src('src/img/**/*.*')
  .pipe(gulp.dest('dist/img'))
}

function fontsToDist(){
  return gulp.src('src/fonts/**/*.*')
  .pipe(gulp.dest('dist/fonts'))
}

function clear(){
  return del('dist/**/*')
}

function serve(){
  browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch('src/**/*.pug', gulp.series(pug2html)).on('change', browserSync.reload)
    gulp.watch('src/**/*.scss', gulp.series(scss)).on('change', browserSync.reload)
    gulp.watch('src/**/*.js', gulp.series(js)).on('change', browserSync.reload)
    gulp.watch('src/libs/**/*.js', gulp.series(scripts)).on('change', browserSync.reload)
    gulp.watch('src/libs/**/*.css', gulp.series(styles)).on('change', browserSync.reload)
    gulp.watch('src/img/**/*.*', gulp.series(imgWebp, imgToDist)).on('change', browserSync.reload)
    gulp.watch('src/fonts/**/*.*', gulp.series(fontsToDist)).on('change', browserSync.reload)
}

exports.serve = gulp.series(clear, image, imgWebp, fontsToDist, js, scss, pug2html, styles, scripts, serve)
exports.build = gulp.series(clear, image, imgWebp, fontsToDist, js, scss, pug2html, styles, scripts)
