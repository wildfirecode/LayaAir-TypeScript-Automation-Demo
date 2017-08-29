define(["require", "exports", "./Greeting"], function (require, exports, Greeting_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // 程序入口
    var GameMain = (function () {
        function GameMain() {
            Laya.init(600, 400);
            new Greeting_1.Greeting();
        }
        return GameMain;
    }());
    new GameMain();
});
//# sourceMappingURL=GameMain.js.map