var gulp = require('gulp');
var saas = require('gulp-sass');

gulp.task('convert', function() {
    gulp.src('scss/style.scss')
    .pipe(saas())
    .pipe(gulp.dest('css'))
});

gulp.task('watch', function() {
    gulp.watch('**/**.scss',['convert'])
});