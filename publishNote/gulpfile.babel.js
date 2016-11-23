import gulp from 'gulp';
import babel from 'gulp-babel';
import watch from 'gulp-watch';
import sourcemaps from 'gulp-sourcemaps';

gulp.task('babel',() => {
    gulp.src('src/**/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel())
        .pipe(sourcemaps.write('../map'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch('src/**/*.js', ['babel']);
});

