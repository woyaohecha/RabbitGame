const { ccclass, property } = cc._decorator;

@ccclass
export default class BgManager extends cc.Component {

    eventNode: cc.Node = null;
    bgPrefabs: cc.Prefab[] = [];
    winSize: cc.Size = cc.winSize;
    moveSpeed: number = 360;//300
    canMove: boolean = false;

    onLoad() {
        this.eventNode = cc.find("EventNode");
        this.eventNode.on("move", () => {
            this.canMove = true;
        }, this);
        this.eventNode.on("stop", () => {
            this.canMove = false;

        })
        this.init();
    }

    update(dt) {
        if (this.canMove) {
            this.bgMove(dt);
        }
    }


    //背景初始化,异步操作
    init() {
        cc.resources.loadDir("bgPrefabs", cc.Prefab, (err: Error, assets: cc.Prefab[]) => {
            if (err) {
                console.log(err);
                return;
            }
            this.bgPrefabs = assets.sort((a, b) => {
                let aIndex = Number(a.name.split("_")[1]);
                let bIndex = Number(b.name.split("_")[1]);
                return aIndex - bIndex;
            })
            let pos = cc.v2(0, 0);
            for (let i = 0; i < this.bgPrefabs.length; i++) {
                let bg = cc.instantiate(this.bgPrefabs[i]);
                bg.setParent(this.node);
                if (i != 0) {
                    pos.x += bg.width / 2;
                }
                bg.setPosition(pos);
                pos.x += bg.width / 2;
            }
            console.log("初始化完成");
            this.node.removeChild(this.node.children[0]);
            this.eventNode.emit("bgInitCompleted");
        })
    }

    bgMove(value) {
        let lastBg = this.node.children[this.node.children.length - 1];
        if (lastBg.x <= this.winSize.width - lastBg.width) {
            //todo:移动到最后一张图，结束
            this.eventNode.emit("stop");
            this.eventNode.emit("rabbitIdle");
            this.eventNode.emit("gameOver");
            return;
        }
        for (let child of this.node.children) {
            child.x -= this.moveSpeed * value;
        }
    }
}
