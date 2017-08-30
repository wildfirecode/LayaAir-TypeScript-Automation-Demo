const gulp = require('gulp'),
    connect = require('gulp-connect'),
    os = require("os");

gulp.task('connect', () =>
    connect.server({
        root: './bin',
        livereload: true
    })
);

gulp.task('compile', () => {
    const cmd = os.platform() == 'win32' ? 'tsc.cmd' : 'tsc';
    const childProcess = require('child_process');
    const child = childProcess.spawn(cmd, []);
    child.stdout.on('data', function (chunk) {
        console.log('[tsc]', chunk + '');
    });
    child.stderr.on('data', function (chunk) {
        console.log('[tsc]', chunk);
    });
    child.on('exit', function (code, signal) {
        console.log('[tsc]', chunk);
    });
    return child;
});

gulp.task('reload', () => {
    return gulp.src('./bin/*.html')
        .pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch(['./bin/js/*.js'], ['reload']);
});

gulp.task('default', ['connect', 'watch', 'compile']);