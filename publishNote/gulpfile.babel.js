import gulp from 'gulp';
import babel from 'gulp-babel';
import watch from 'gulp-watch';
import sourcemaps from 'gulp-sourcemaps';

gulp.task('babel',() => {
    gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('../maps', {
            mapSources: function(sourcePath) {
            // source paths are prefixed with '../src/'
            return '../src/' + sourcePath;
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch('src/**/*.js', ['babel']);
});

