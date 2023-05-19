const { ccclass, property } = cc._decorator;

@ccclass
export default class BoatManager extends cc.Component {

    eventNode: cc.Node = null;
    canMove: boolean = false;

    rabbit: cc.Node = null;

    onLoad() {
        this.eventNode = cc.find("EventNode");
        this.eventNode.on("boatMove", (rabbit) => {
            this.rabbit = rabbit;
            this.canMove = true;
        }, this);
    }

    start() {

    }

    update(dt) {
        if (this.canMove) {
            if (this.node.x >= 30) {
                this.canMove = false;
                this.eventNode.emit("rabbitJump", true);
            }
            this.node.x += 240 * dt;
            let worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
            let pos = this.rabbit.parent.convertToNodeSpaceAR(worldPos);
            this.rabbit.setPosition(pos);
        }
    }
}

