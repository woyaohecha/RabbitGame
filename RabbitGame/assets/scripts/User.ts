import Tools from "./Tools";

const { ccclass, property } = cc._decorator;
// const url = "http://forest-game.sxycykj.net//api/app/clientAPI";
const url = "https://forest-game.sxycykj.net//api/app/clientAPI";
@ccclass
export default class User {

    private static _instance: User;

    //获奖记录
    private rewardList: any[] = [];
    //uid
    private uid: number = 0;
    //本次抽奖结果
    private reward: any = {};

    private constructor() {
        //若有缓存数据，则获取uid并根据uid从服务器获取相关数据
        //若无缓存数据，则创建uid并保存uid并从服务器获取相关数据
        if (cc.sys.localStorage.getItem("uid")) {
            this.uid = Number(cc.sys.localStorage.getItem("uid"));
        } else {
            //随机获得uid
            this.uid = Tools.getRandomNum(10000000, 99999999);
            //本地存储、服务器存储 uid
            cc.sys.localStorage.setItem("uid", this.uid);
            this.saveUserInfo();
        }

        //根据uid从服务器获取奖品数据
        this.getUserRewardInfo();
        //根据uid从服务器获取抽奖数据
        this.getLuckDrawInfo();

        console.log("uid:" + this.uid);
    }


    public static getInstance() {
        if (!User._instance) {
            User._instance = new User();
        }
        return User._instance;
    }

    public getRewardList() {
        return this.rewardList;
    }

    public getReward() {
        return this.reward;
    }

    //保存用户信息：saveUserInfo(uid:number,name:string)-------1
    public saveUserInfo() {
        let myUrl = url + "/saveUserInfo/?uid=" + this.uid + "&name=" + this.uid;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                let data = JSON.parse(response).data;
                // console.log("保存用户信息-----------------", data);
            }
        };
        xhr.open("GET", myUrl, true);
        xhr.send();
    }

    //获取用户中奖信息:getUserRewardInfo(uid:number)--------2
    public getUserRewardInfo() {
        let myUrl = url + "/getUserRewardInfo/?uid=" + this.uid;
        let xhr = new XMLHttpRequest();
        let self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                let data = JSON.parse(response).data;
                if (data.length == 0) {
                    self.rewardList = [];
                } else {
                    self.rewardList = data;
                }
                // console.log("获取用户中奖记录-----------------", self.rewardList);
            }
        };
        xhr.open("GET", myUrl, true);
        xhr.send();
    }

    //获取抽奖数据:getLuckDrawInfo(uid:number)------------3
    public getLuckDrawInfo() {
        let myUrl = url + "/getLuckDrawInfo/?uid=" + this.uid;
        let xhr = new XMLHttpRequest();
        let self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                let data = JSON.parse(response).data;
                if (data) {
                    self.reward = data;
                }
                else {
                    self.reward = { cell: 2, reward_url: "" };
                }
            }
            // console.log("获取用户抽奖数据-----------------", self.reward)
        };
        xhr.open("GET", myUrl, true);
        xhr.send();
    }
}
