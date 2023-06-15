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

    lottery: cc.Node = null;
    result: cc.Node = null;


    onLoad() {
        this.user = User.getInstance();
        this.eventNode = cc.find("EventNode");
        this.lottery = this.node.getChildByName("Lottery");
        this.result = this.node.getChildByName("Result");
        this.init();
    }

    start() {

    }

    init() {
        this.lottery.active = true;;
        this.result.active = false;;
        this.lotterying = false;
    }

    //value:0-未中奖  1-话费  2-京东 3-美团
    //
    startLottery(value: number) {
        if (value > 3) return;

        let pan = this.lottery.getChildByName("Pan");



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
                this.lottery.active = false;
                this.showResult(value);
            })
            .start();

    }

    showResult(value) {
        for (let child of this.result.children) {
            child.active = false;
        }

        let btnBack = this.result.getChildByName("BtnBack");
        let btnTo = this.result.getChildByName("BtnTo");
        switch (value) {
            case 0:
                this.result.children[0].active = true;
                btnBack.active = true;
                break;
            case 1:
                this.result.children[1].active = true;
                btnTo.active = true;
                break;
            case 2:
                this.result.children[2].active = true;
                btnTo.active = true;
                break;
            case 3:
                this.result.children[3].active = true;
                btnTo.active = true;
                break;
        }
        this.result.active = true;
        this.lotterying = false;
    }

    lotterying: boolean = false;
    webUrl: string = "";
    btnLottery() {
        if (this.lotterying) return;
        this.lotterying = true;
        let cell = this.user.getReward().cell;
        let url = this.user.getReward().reward_url;
        this.webUrl = url;
        let result;
        switch (cell) {
            case 1:
                result = 1;
                break;
            case 2:
                result = 2;
                break;
            case 3:
                result = 3;
                break;
            case 4:
            case 5:
            case 6:
            default:
                result = 0;
                break;
        }
        this.startLottery(result);
    }

    onBtnBack() {
        let canvas: cc.Canvas = cc.find("Canvas").getComponent(cc.Canvas);;
        Tools.setSceneDir(canvas, 0);
        cc.director.loadScene("Index");
    }

    onBtnToWeb() {
        console.log(this.webUrl);
        if (this.webUrl != "") {
            window.location.href = this.webUrl;
        } else {
            this.onBtnBack();
        }


    }


}
