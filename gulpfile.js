var gulp = require('gulp');
var livereload = require('gulp-livereload');
var childProcess = require('child_process');


gulp.task('livereload', [], function () {
    livereload({ start: true });
    gulp.watch('./bin/**/*.*', (file) => {
        livereload.changed(file.path);
    });
});

gulp.task('compile', [], function () {
    gulp.watch('./src/**/*.ts', (file) => {
        console.log(file);
        var child = childProcess.spawn('tsc.cmd', [
            "-p",
            ".",
            "--outDir",
            "bin/js"
        ]);
        var t1 = new Date().getTime();
        console.log('compile start...');
        child.stdout.on('data', function (chunk) {
            console.log(chunk + '')
        });
        child.stderr.on('data', function (chunk) {
            console.log('error', chunk)
        });
        child.on('exit', function (code, signal) {
            var t2 = new Date().getTime();
            console.log(`compile end within ${t2 - t1} ms`);
        });
    });
});

gulp.task('default', ['livereload', 'compile'], function () {
    //增加了ts文件之后要重新开启gulp任务
    //每次开启gulp任务的时候都要更新下html
    var t1 = new Date().getTime();
    var FileHtmlHandler = require('./FileHtmlHandler');
    FileHtmlHandler.htmlHandlerScript();
    var t2 = new Date().getTime();
    console.log(`htmlHandlerScript end within ${t2 - t1} ms`);
});