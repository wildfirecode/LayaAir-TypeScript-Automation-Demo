import { Greeting } from './Greeting';
// 程序入口
class GameMain {
    constructor() {
        Laya.init(600, 400);
        new Greeting();
    }
}

new GameMain();