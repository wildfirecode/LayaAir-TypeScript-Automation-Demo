# 自动化的基于TypeScript的HTML5游戏开发
## 自动化的开发流程
在HTML5游戏开发或者说在Web客户端开发中，我们对项目代码进行修改之后，一般来说，需要手动刷新浏览器来查看代码修改后运行结果。这种手动的方式费时费力，降低了开发效率。另外，如果我们使用了如TypeScript这类需要通过转换器把代码转换成浏览器可识别的JavaScript代码的语言，在运行程序之前，我们还需要进行额外的转换的过程。为了解决这两个问题，本文介绍了如何通过使用TypeScript Compiler(tsc)的watch模式来实现代码修改后自动编译以及使用gulp-connect来实现编译后浏览器自动刷新。

## 开发环境
- Visual Studo Code 1.15
- node v8.4.0
- npm 5.3.0

## 示例和源码
本文将通过一个完整的实例来讲解如何实现开发自动化，实例的源码托管在github。示例所采用的HTML5游戏引擎为LayaAir。目前已经在Windows和Mac OSX系统测试通过。这里是[仓库链接][demo]。另外，示例项目是使用VS Code(Visual Studio Code)来开发的。我们常用的HTML5游戏集成开发环境Laya IDE以及Egret Wing等也是基于VS Code开发的，部分相关知识也可以借鉴。另外本文使用了AMD来管理项目的代码，关于如何在HTML5游戏中使用AMD请参考我的另一篇文章[《借助AMD来解决HTML5游戏开发中的痛点》][amd]。

## 使用tsc的watch模式实现自动化编译
tsc天生就支持自动化编译和增量编译。在`tsconfig.json`中的`compilerOptions`属性中增加`"wathc":true`配置即可。这样我们执行命令`tsc -p .`的时候便可以使用这些特性了。

## 使用gulp和gulp-connect实现编译后浏览器自动刷新
gulp是一种基于nodejs的自动化构建工具，它可以增强我们的工作流程。gulp-connect是gulp的一个插件，主要提供web服务器和自动化浏览器刷新功能。在本文的参考资料列表中可以查看更多的关于gulp和gulp-connect的信息。下面我讲详细讲解自动化流程的创建。

## 安装
gulp是基于nodejs，所以首先要安装nodejs环境，具体安装过程以及nodejs相关知识我们可以参考[nodejs官方网站][nodejs]。

nodejs安装完毕之后，需要初始化项目：
    
    npm init
接着，通过执行命令来全局安装 gulp和tsc：

    npm install -g gulp typescript

下面安装开发依赖
    
    npm install --save-dev gulp gulp-connect

## 创建gulpfile.js
在项目根目录下创建一个名为`gulpfile.js`的文件，我们的自动化流程逻辑全部在这里。

首先我们要创建一个web server，因为`gulp-connect`使用WebSocket和浏览器进行通信，所以这是实现浏览器自动刷新的必要条件。我们来创建一个`connect`任务以实现这个功能。web server的默认端口为8080。
```js
gulp.task('connect', () =>
    connect.server({
        root: './bin',
        livereload: true
    })
);
```
下面我们创建一个`watch`任务来实现对编译文件的内容变化的监听，当检测到变化之后则执行一个名为`reload`的任务。`reload`任务负责通知浏览器对当前的html页面进行刷新。
```js
gulp.task('reload', () => {
    return gulp.src('./bin/*.html')
        .pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch(['./bin/js/*.js'], ['reload']);
});
```
为了自动化执行编译命令`tsc`，我们创建一个`compile`任务来完成这件事。
```js
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
```
当ts文件发生变化的时候，我们可以在控制台的日志中看到`tsc`的自动化编译的工作过程。
最后创建`default`任务，以触发其他所有任务的执行。
```js
gulp.task('default', ['connect', 'watch', 'compile']);
```

## 配置VS Code
我们需要安装VS Code插件Debugger for Chrome，以实现使用Chrome在VS Code中调试运行代码。

接着，我们可以按下`F5`，并选择`chrome`来自动生成调试配置`launch.json`，此文件位于`.vscode`文件夹。

下面，按下`F1`，并输入`Configure Default Build Task`来快速找到`配置默认生成任务`选项，选择之后弹出`任务列表`，在列表中选中`gulp:default`之后，`task.json`文件会自动生成，并置于`.vscode`文件夹。`task.json`使得我们可以把gulp:default作为默认的构建任务。

至此，所有的配置和编程处理完毕。

## 开启自动化的开发之旅
按下快捷键`Ctrl+Shift+B`或者在终端中执行`gulp`来触发`gulp:default`：
- 创建一个web服务器
- 执行tsc，在ts文件发生变化之后自动编译
- 监听编译文件的变化，文件变化之后会通知浏览器刷新

接下来，我们可以在浏览器中输入`http://localhost:8080`来运行游戏。

然后修改`Greeting.ts`文件，把`Hello LayaAir`修改为`Hello HTML5 Game.`，保存文件之后，便会发现游戏中的显示文本修改为`Hello HTML5 Game.`. 具体请看下面的动图。
如有其他的配置疑问，请参考示例项目的源码。

参考
- [nodejs官网][nodejs]
- [gulp中文网][gulp]
- [gulp-connect官网][connect]

[amd]:http://www.cnblogs.com/wildfirecode/p/7382612.html
[demo]:https://github.com/wildfirecode/LayaAir-TypeScript-Automation-Demo
[nodejs]:https://nodejs.org/
[gulp]:http://www.gulpjs.com.cn/
[connect]:https://github.com/avevlad/gulp-connect