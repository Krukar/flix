var gulp = require('gulp'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
ts = require('gulp-typescript'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename');

// Sass -> CSS
gulp.task('css', function () {
	return gulp.src('./scss/style.scss')
	.pipe(sass({
		outputStyle: 'compressed'
	})
	.on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(gulp.dest('../'));
});

// TS -> JS
gulp.task('ts', function () {
	return gulp.src('./ts/**/*.ts')
	.pipe(ts({
		noImplicitAny: true,
		out: 'main.js',
		target: 'ES5'
	}))
	.pipe(gulp.dest('./js'));
});

// Compile JS
gulp.task('js', ['ts'], function() {
	return gulp.src(['./node_modules/jquery/dist/jquery.min.js',
		'js/main.js'])
	.pipe(concat('app.js'))
	.pipe(gulp.dest('./'));
});

gulp.task('min', function() {
	return gulp.src('app.js')
	.pipe(uglify({
		compress:{
			drop_console: true
		}
	}))
	.pipe(rename('app.min.js'))
	.pipe(gulp.dest('../'));
});

gulp.task('default', ['css', 'js'], function() {
	gulp.watch(['./scss/**/*.scss'], ['css']);  
	gulp.watch(['./ts/**/*.ts'], ['js']);
	gulp.watch(['app.js'], ['min']);
});