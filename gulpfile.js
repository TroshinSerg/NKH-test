'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

//var posthtml = require("gulp-posthtml");
//var include = require("posthtml-include");

var image = require('gulp-image');
var newer = require('gulp-newer');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var del = require("del");

var scriptsPath = ['source/js/main.js'];

gulp.task('server', function() {
	browserSync.init({
		server: './build'
	});

	 gulp.watch('source/scss/**/*.scss', gulp.series('sass'));
   gulp.watch('source/**/*.html', gulp.series('html', 'refresh'));
	 //gulp.watch('source/icons/*.svg', gulp.series('sprite', 'html', 'refresh'));
	 gulp.watch('source/js/*.js', gulp.series('scripts'));
	 gulp.watch('source/img/**/*.{png,jpg,svg,webp}', gulp.series('img', 'webp'));
});

gulp.task('refresh', function(done) {
  browserSync.reload();
  done();
});

gulp.task('sass', function() {
	return gulp.src('source/scss/main.scss')
		.pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'SASS',
          sound: false,
          message: err.message
        }
      })
    }))
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({
				grid: true
			})
		]))
		.pipe(gulp.dest('build/css'))
		.pipe(csso())
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.stream());
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    /*.pipe(posthtml([
      include()
    ]))*/
    .pipe(gulp.dest("build"));
});

gulp.task('scripts', function() {
  return gulp.src(scriptsPath)
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'js',
          sound: false,
          message: err.message
        }
      })
    }))
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build/js"))
    .pipe(browserSync.stream());
});

gulp.task('img', function() {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(newer('build/img'))
    .pipe(image({
        mozjpeg: false,
        jpegoptim: false,
        jpegRecompress: true
    }))
    .pipe(gulp.dest('build/img'));
});

gulp.task('webp', function() {
  return gulp.src('build/img/**/*.{png,jpg}')
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('build/img'));
});
/*
gulp.task('sprite', function() {
  return gulp.src('source/icons/*.svg')
    .pipe(image())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
});*/

gulp.task('clean', function() {
  return del('build');
});

gulp.task('copy', function() {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/js/**'
    ],{
      base: 'source'
    })
    .pipe(gulp.dest('build'));
});

gulp.task('copy:img', function() {
  return gulp.src([
    'source/images/**/*.{jpg,png,svg}',
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build'));
});

gulp.task('default', gulp.series('clean', 'copy', 'img', 'webp', 'scripts', 'sass', 'html', 'server'));
