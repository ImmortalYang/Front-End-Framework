var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var sass = require('gulp-sass');

gulp.task('styles', function(){
	return gulp.src('./app/assets/styles/styles.scss')
		.pipe(sass())
		.on('error', function(errorInfo){
			console.log(errorInfo.toString());
			this.emit('end');
		})
		.pipe(gulp.dest('./app/temp/styles'));
});