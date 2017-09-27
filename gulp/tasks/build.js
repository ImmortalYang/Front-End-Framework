var gulp = require('gulp');
var del = require('del');
// Minify PNG, JPEG, GIF and SVG images
var imageMin = require('gulp-imagemin');
// Replaces references to non-optimized scripts or stylesheets into a set of HTML files (or any templates/views).
var useMin = require('gulp-usemin');
// Static asset revisioning by appending content hash to filenames unicorn.css → unicorn-d41d8cd98f.css
var rev = require('gulp-rev');
// Minify css file
var cssnano = require('gulp-cssnano');
// Minify js file
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

gulp.task('previewDist', function(){
	browserSync.init({
		notify: false,
		server: {
			baseDir: "docs"
		}
	});
});

gulp.task('deleteDistFolder', function(){
	return del('./docs');
});

gulp.task('copyGeneralFiles', ['deleteDistFolder'], function(){
	var pathsToCopy = [
		'./app/**/*', 
		'!./app/index.html',
		'!./app/assets/images/**',
		'!./app/assets/styles/**',
		'!./app/assets/scripts/**',
		'!./app/temp',
		'!./app/temp/**'
	];
	return gulp.src(pathsToCopy)
		.pipe(gulp.dest('./docs'));
});

gulp.task('optimizeImages', ['deleteDistFolder'], function(){
	return gulp.src(['./app/assets/images/**/*', '!./app/assets/images/icons', '!./app/assets/images/icons/**/*'])
		.pipe(imageMin({
			progressive: true,
			interlaced: true,
			multipass: true
		}))
		.pipe(gulp.dest('./docs/assets/images'));
});

gulp.task('useminTrigger', ['deleteDistFolder'], function(){
	gulp.start('usemin');
});

gulp.task('usemin', ['styles', 'scripts'], function(){
	return gulp.src('./app/index.html')
		.pipe(useMin({
			css: [function(){
				return rev();
			}, 
			function(){
				return cssnano();
			}],
			js: [function(){
				return rev();
			}, 
			function(){
				return uglify();
			}]
		}))
		.pipe(gulp.dest('./docs'));
});

gulp.task('build', 
	['deleteDistFolder', 'copyGeneralFiles', 'optimizeImages', 'useminTrigger'], 
	function(){
		gulp.start('previewDist');
});
