import AudioManager from "./AudioManager";
import Tools from "./Tools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Node)
    rabbit: cc.Node = null;

    @property(cc.Node)
    loading: cc.Node = null;

    collisionManager: cc.CollisionManager = null;
    eventNode: cc.Node = null;
    initCount: number = 0;
    isStart: boolean = false;
    carrotNum: number = 0;
    inBoat = false;


    onLoad() {
        this.collisionManager = cc.director.getCollisionManager();
        this.eventNode = cc.find("EventNode");
        this.eventNode.on("collisonEnter", this.collisonEnter, this);
        this.eventNode.on("bgInitCompleted", () => {
            // this.loading.active = false;
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
            this.collisionManager.enabled = true;
        });
        this.eventNode.on("countCarrotByQuestion", (value) => {
            this.carrotNum = this.carrotNum + value > 0 ? this.carrotNum + value : 0;
            this.eventNode.emit("carrotCount", this.carrotNum);
        }, this)
        this.eventNode.on("gameOver", () => {
            this.eventNode.emit("over", this.carrotNum);
        }, this)
        // cc.debug.setDisplayStats(true);

    }

    init() {
        this.isStart = false;
        this.carrotNum = 0;
    }

    onTouch() {
        if (!this.isStart) {
            this.eventNode.emit("move");
            this.eventNode.emit("rabbitRun");
            this.eventNode.emit("isStart");
            this.isStart = true;
            return;
        }
        this.eventNode.emit("rabbitJump");
    }


    collisonEnter(other) {
        console.log(other.node.name);
        if (other.tag != 0) {
            this.eventNode.emit("stop");
            this.eventNode.emit("rabbitIdle", true);
        }
        switch (other.tag) {
            case 0:
                AudioManager.playSound("score");
                this.carrotNum += 10;
                this.eventNode.emit("carrotCount", this.carrotNum);
                other.node.destroy();
                break;
            case 1:
                let anim_1: cc.Animation = other.node.getComponent(cc.Animation);
                this.scheduleOnce(() => {
                    this.eventNode.emit("popTips", "name");
                }, 1)
                // anim_1.once("finished", () => {
                //     this.eventNode.emit("popTips", "name");
                // }, this);
                anim_1.play("fox_talk");
                AudioManager.playSound("talk");
                break;
            case 2:
                let anim_2: cc.Animation = other.node.getComponent(cc.Animation);
                this.scheduleOnce(() => {
                    this.eventNode.emit("popTips", "name");
                }, 1)
                // anim_2.once("finished", () => {
                //     this.eventNode.emit("popTips", "name");
                // }, this);
                anim_2.play("rat_talk");
                AudioManager.playSound("talk");
                break;
            case 3:
                let anim_3: cc.Animation = other.node.getComponent(cc.Animation);
                this.scheduleOnce(() => {
                    this.eventNode.emit("popTips", "name");
                }, 1)
                // anim_3.once("finished", () => {
                //     this.eventNode.emit("popTips", "name");
                // }, this);
                anim_3.play("wolf_talk");
                AudioManager.playSound("talk");
                break;
            case 4:
                let anim_4: cc.Animation = other.node.getComponent(cc.Animation);
                this.scheduleOnce(() => {
                    this.eventNode.emit("popTips", "name");
                }, 1)
                // anim_4.once("finished", () => {
                //     this.eventNode.emit("popTips", "name");
                // }, this);
                anim_4.play("cheetah_talk");
                AudioManager.playSound("talk");
                break;
            case 5:
                let worldPos = other.node.convertToWorldSpaceAR(cc.v2(0, 0));
                let pos = this.rabbit.parent.convertToNodeSpaceAR(worldPos);
                let ctrlPos = cc.v2((this.rabbit.x - pos.x) / 2, 100);
                cc.tween(this.rabbit)
                    .bezierTo(1, ctrlPos, ctrlPos, pos)
                    .call(() => {
                        this.eventNode.emit("move");
                        this.eventNode.emit("boatMove", this.rabbit);
                    }, this)
                    .start();
                AudioManager.playSound("river");
                break;
            case 6:
                let anim_6: cc.Animation = other.node.getComponent(cc.Animation);
                this.scheduleOnce(() => {
                    this.eventNode.emit("popTips", "name");
                }, 1)
                // anim_6.once("finished", () => {
                //     this.eventNode.emit("popTips", "name");
                // }, this);
                anim_6.play("owl_talk");
                AudioManager.playSound("talk");
                break;
            case 7:
                this.eventNode.emit("popTips", "name");
                break;
            case 8:
                this.eventNode.emit("popTips", "name");
                break;
            case 9:
                let anim_9: cc.Animation = other.node.getComponent(cc.Animation);
                this.scheduleOnce(() => {
                    this.eventNode.emit("popTips", "name");
                }, 1)
                // anim_9.once("finished", () => {
                //     this.eventNode.emit("popTips", "name");
                // }, this);
                anim_9.play("peacock_open");
                AudioManager.playSound("talk");
                break;
            default:
                break;
        }
    }
}
