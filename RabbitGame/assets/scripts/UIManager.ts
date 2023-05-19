import AudioManager from "./AudioManager";
import Tools from "./Tools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    @property(cc.Label)
    carrotNum: cc.Label = null;

    @property(cc.Node)
    loading: cc.Node = null;

    @property(cc.Node)
    popUpQuestion: cc.Node = null;

    @property(cc.Node)
    popUpStart: cc.Node = null;

    @property(cc.Node)
    popUpLottery: cc.Node = null;

    @property(cc.Node)
    popUpOver: cc.Node = null;

    @property(cc.JsonAsset)
    questionJson: cc.JsonAsset = null;

    @property(cc.Node)
    tips: cc.Node = null;

    @property(cc.Node)
    safeTipsPanel: cc.Node = null;


    eventNode: cc.Node = null;
    questionList: any[] = [];

    questionIndex: number = 0;
    groupNum: number = 4;
    groupIndex: number = 0;

    onLoad() {
        AudioManager.playBGM("bgm");
        this.eventNode = cc.find("EventNode");
        this.eventNode.on("bgInitCompleted", this.startTips, this);
        this.eventNode.on("isStart", () => {
            this.tips.active = false;
        }, this);
        this.eventNode.on("carrotCount", this.carrotCount, this);
        this.eventNode.on("popTips", this.popTips, this);
        this.eventNode.on("over", this.over, this);
        this.init();
    }

    //ui初始化
    init() {
        this.questionList = Tools.shuffle(this.questionJson.json);
        this.questionIndex = 0;
        this.carrotNum.string = "" + 0;
        this.popUpQuestion.active = false;
        this.popUpLottery.active = false;
        this.popUpOver.active = false;
        this.tips.active = false;
        this.loading.active = true;


        let closeBtn = this.popUpStart.getChildByName("StartPanel").getChildByName("BtnClose");
        closeBtn.active = false;
        this.popUpStart.active = true;
        this.scheduleOnce(() => {
            closeBtn.active = true;
        }, 3);
    }


    showSafeTips() {
        let index = Tools.getRandomNum(1, 8);
        this.safeTipsPanel.setPosition(-1300, 155);
        cc.resources.load("safeTips/" + index, cc.Prefab, (e, asset: cc.Prefab) => {
            if (e) {
                console.log(e);
                return;
            }
            let safeTips = cc.instantiate(asset);
            this.safeTipsPanel.addChild(safeTips);
            cc.tween(this.safeTipsPanel)
                .to(1, { x: 0 })
                .call(() => {
                    this.scheduleOnce(() => {
                        this.safeTipsPanel.removeChild(safeTips);
                    }, 4);
                })
                .start();
        });
    }

    //引导提示
    startTips() {
        this.loading.active = false;
        this.tips.getComponent(cc.Label).string = "点击屏幕跳跃";
        this.tips.active = true;
    }

    carrotCount(value) {
        this.carrotNum.string = "" + value;
    }

    //根据传来的弹窗name，进行对应弹窗操作
    popTips() {
        let questionPanel = this.popUpQuestion.getChildByName("QuestionPanel");
        let judgeTips = questionPanel.getChildByName("JudgeTips");
        judgeTips.active = false;
        let questionLabel = questionPanel.getChildByName("Question").getComponent(cc.Label);
        let ALabel = questionPanel.getChildByName("A").getChildByName("Answer").getComponent(cc.Label);
        let BLabel = questionPanel.getChildByName("B").getChildByName("Answer").getComponent(cc.Label);

        let currentQuestion = this.questionList[this.questionIndex];

        questionLabel.string = currentQuestion.question;
        ALabel.string = currentQuestion.items[0];
        BLabel.string = currentQuestion.items[1];
        this.popUpQuestion.active = true;
    }

    judgeAnswer(e) {
        let answer = this.questionList[this.questionIndex].answer;
        let clickedName = e.target.name;
        let judgeTips = this.popUpQuestion.getChildByName("QuestionPanel").getChildByName("JudgeTips");
        let isRight: boolean = false;

        if ((Number(answer) == 0 && clickedName == "A") || (Number(answer) == 1 && clickedName == "B")) {
            judgeTips.getComponent(cc.Label).string = "回答正确";
            judgeTips.color = cc.Color.GREEN;
            isRight = true;
            AudioManager.playSound("score");
        } else {
            judgeTips.getComponent(cc.Label).string = "回答错误";
            judgeTips.color = cc.Color.RED;
            isRight = false;
        }
        this.questionIndex++;
        this.scheduleOnce(() => {
            judgeTips.active = false;
            this.closePopUp();
            this.scheduleOnce(() => {
                let value = isRight ? 10 : -20;
                this.tips.getComponent(cc.Label).string = isRight ? "回答正确，+10积分" : "回答错误，-20积分";
                this.tips.active = true;
                this.eventNode.emit("countCarrotByQuestion", value);
                this.scheduleOnce(() => {
                    this.tips.active = false;
                }, 1);
            })
        }, 0.3)
    }

    closePopUp() {
        this.popUpQuestion.active = false;
        this.eventNode.emit("move");
        this.eventNode.emit("rabbitRun");
    }

    closeStart() {
        this.popUpStart.active = false;
        this.showSafeTips();

        // this.tips.getComponent(cc.Label).string = "点击屏幕跳跃";
        // this.tips.active = true;
        // this.scheduleOnce(() => {
        //     this.tips.active = false;
        // }, 1.5)
    }

    over(score: number) {
        let scoreLabel = this.popUpOver.getChildByName("OverPanel").getChildByName("Score").getComponent(cc.Label);
        let desLabel = this.popUpOver.getChildByName("OverPanel").getChildByName("Des").getComponent(cc.Label);
        let btnLabel = this.popUpOver.getChildByName("OverPanel").getChildByName("BtnContinue").getComponent(cc.Label);
        scoreLabel.string = "积分：" + score;
        if (score >= 60) {
            desLabel.string = "恭喜，您可以参与大转盘抽奖活动！";
            btnLabel.string = "点击此处进入抽奖";
        } else {
            desLabel.string = "很遗憾，您的积分不足以参加大转盘抽奖活动";
            btnLabel.string = "点击此处返回首页";
        }
        this.popUpOver.active = true;
    }

    btnClick(e) {
        if (e.target.getComponent(cc.Label).string == "点击此处进入抽奖") {
            this.popUpOver.active = false;
            this.popUpLottery.active = true;
        } else {
            let canvas: cc.Canvas = cc.find("Canvas").getComponent(cc.Canvas);;
            Tools.setSceneDir(canvas, 0);
            cc.director.loadScene("Index");
        }
    }
}
