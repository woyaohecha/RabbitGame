import Tools from "./Tools";
import User from "./User";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Index extends cc.Component {

    @property(cc.Node)
    awards: cc.Node = null;

    rewardList: any[] = [];

    index: cc.Node = null;
    rule: cc.Node = null;
    mine: cc.Node = null;
    bottom: cc.Node = null;
    user: User;

    onLoad() {
        // cc.sys.localStorage.clear();
        this.user = User.getInstance();
        cc.director.preloadScene("Game");

        this.index = this.node.getChildByName("Index");
        this.rule = this.node.getChildByName("Rule");
        this.mine = this.node.getChildByName("Mine");
        this.bottom = this.node.getChildByName("Bottom");

        this.init();
    }

    init() {
        this.index.active = true;
        this.rule.active = false;
        this.mine.active = false;
        this.bottom.active = true;
    }

    start() {
    }

    startGame() {
        let canvas: cc.Canvas = cc.find("Canvas").getComponent(cc.Canvas);
        Tools.setSceneDir(canvas, 1);
        cc.director.loadScene("Game");
    }

    openIndex() {
        this.index.active = true;
        this.rule.active = false;
        this.mine.active = false;
        this.bottom.active = true;
    }

    openRule() {
        this.index.active = false;
        this.rule.active = true;
        this.mine.active = false;
        this.bottom.active = true;
    }

    openMine() {
        this.rewardList = this.user.getRewardList();
        for (let child of this.awards.children) {
            child.active = false;
        }
        if (this.rewardList.length == 0) {
            this.awards.children[0].active = true;
        } else {
            // let id = this.rewardList[0].id;
            let id = 4;
            let index;
            switch (id) {
                case 1:
                    index = 1;
                    break;
                case 2:
                    index = 2;
                    break;
                case 3:
                    index = 3;
                    break;
                case 4:
                case 5:
                case 6:
                    index = 0;
                    break;
            }
            this.awards.children[index].active = true;
        }
        this.index.active = false;
        this.rule.active = false;
        this.mine.active = true;
        this.bottom.active = true;
    }
}
