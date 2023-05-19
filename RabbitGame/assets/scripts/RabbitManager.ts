import AudioManager from "./AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RabbitManager extends cc.Component {

    eventNode: cc.Node = null;
    canJump: boolean = true;
    needIdle: boolean = false;

    onLoad() {
        this.eventNode = cc.find("EventNode");
        this.eventNode.on("rabbitRun", this.rabbitRun, this)
        this.eventNode.on("rabbitJump", this.rabbitJump, this);
        this.eventNode.on("rabbitIdle", this.rabbitIdle, this);
        // this.eventNode.on("boatStop",)
    }

    start() {

    }

    //兔子初始化
    init() {
        this.getComponent(cc.Animation).play("rabbit_idle");
        this.canJump = true;
    }

    onCollisionEnter(other) {
        this.eventNode.emit("collisonEnter", other);
    }

    rabbitIdle(needIdle) {
        if (needIdle) {
            this.needIdle = true;
        }
        this.canJump = false;
        this.getComponent(cc.Animation).play("rabbit_idle");
    }

    rabbitJump(toBoat) {
        if (!this.canJump && !toBoat) {
            return;
        }
        if (toBoat) {
            this.needIdle = false;
        }
        AudioManager.playSound("jump");
        this.getComponent(cc.Animation).play("rabbit_run");
        this.canJump = false;
        cc.tween(this.node)
            .to(0.5, { y: 100 }, { easing: "sineOut" })
            .to(0.5, { y: -400 }, { easing: "sineIn" })
            .call(() => {
                if (!this.needIdle) {
                    this.canJump = true;
                }
            }, this)
            .start();
    }

    jumpStop() {
        cc.tween(this.node).stop();
    }

    rabbitRun() {
        this.needIdle = false;
        this.canJump = true;
        this.getComponent(cc.Animation).play("rabbit_run");
    }
}
