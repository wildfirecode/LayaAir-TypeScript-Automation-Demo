import { getColor } from './getColor';
import { Text } from 'LayaAdapter';
export class Greeting {
    constructor() {
        const hello = new Text();
        hello.text = 'Hello LayaAir';
        hello.fontSize = 20;
        hello.color = getColor();
        Laya.stage.addChild(hello);
    }
}
