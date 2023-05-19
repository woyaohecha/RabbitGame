// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Tools from "./Tools";
import User from "./User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Lottery extends cc.Component {

    eventNode: cc.Node = null;

    user: User;


    onLoad() {
        this.user = User.getInstance();
        this.eventNode = cc.find("EventNode");
        this.init();
    }

    start() {

    }

    init() {
        let lottery = this.node.getChildByName("Lottery");
        let result = this.node.getChildByName("Result");
        lottery.active = true;
        result.active = false;
        this.lotterying = false;
    }

    //value:0-未中奖  1-话费  2-京东 3-美团
    startLottery(value: number) {
        if (value > 3) return;

        let lottery = this.node.getChildByName("Lottery");
        let pan = lottery.getChildByName("Pan");



        let rotateAngle: number = 0;
        let random = Math.random();
        switch (value) {
            case 0:
                let angle_0 = random <= 0.33 ? -60 : random <= 0.66 ? -180 : -300
                rotateAngle = -360 * 5 + angle_0;
                break;
            case 1:
                let angle_3 = -120;
                rotateAngle = -360 * 5 + angle_3;
                break;
            case 2:
                let angle_2 = -240;
                rotateAngle = -360 * 5 + angle_2;
                break;
            case 3:
                let angle_1 = random <= 0.5 ? 0 : -360;
                rotateAngle = -360 * 5 + angle_1;
                break;


        }
        let time = Math.abs(rotateAngle / 180);
        console.log(rotateAngle, time);
        cc.tween(pan)
            .to(time, { angle: rotateAngle }, { easing: "quintOut" })
            .call(() => {
                lottery.active = false;
                this.showResult(value);
            })
            .start();

    }

    showResult(value) {
        let result = this.node.getChildByName("Result");
        for (let child of result.children) {
            if (child.name == "BtnContinue")
                continue;
            child.active = false;
        }

        switch (value) {
            case 0:
                result.children[0].active = true;
                break;
            case 1:
                result.children[1].active = true;
                break;
            case 2:
                result.children[2].active = true;
                break;
            case 3:
                result.children[3].active = true;
                break;
        }
        result.active = true;
        this.lotterying = false;
    }

    lotterying: boolean = false;
    btnLottery() {
        if (this.lotterying) return;
        this.lotterying = true;
        let cell = this.user.getReward().cell;
        console.log(cell);
        let result;
        switch (cell) {
            case 1:
                result = 1;
                break;
            case 3:
                result = 2;
                break;
            case 5:
                result = 3;
                break;
            case 2:
            case 4:
            case 5:
            default:
                result = 0;
                break;
        }
        this.startLottery(result);
    }

    backIndex() {
        let canvas: cc.Canvas = cc.find("Canvas").getComponent(cc.Canvas);;
        Tools.setSceneDir(canvas, 0);
        cc.director.loadScene("Index");
    }


}
