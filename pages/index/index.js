// 获取应用实例
const app = getApp();
// base64资源
const base64 = require("../../base64/base64");
// 引入常量
const constants = require("../../constants/constants");
// 引入封装好的请求方法
const request = require("../../utils/request");

Page({
  data: {
    // 用户头像，用户昵称和头像 class
    avatarBoxClass: [`avatarBox`, `avatarBoxAnim`],
    avatarUrl: app.globalData.userInfo.avatarUrl,
    nickName: app.globalData.userInfo.nickName,
    // 图标
    help: base64.helpIconColorfff,
    addLocation: base64.addLocationIconColorffaa7a,
    setting: base64.settingIconColorfff,
    locationEdit: base64.editIconColorfff,
    indexSearchIcon: base64.searchIconColorffaa7a,
    whatsIn: base64.homeIconColorful,
    beChef: base64.chefIconColorb41616,
    meat: base64.meatIconColorful,
    mission: base64.missionIconColorb41616,
    msg: base64.msgIconColorful,
    finger: base64.fingerIconColor666,
    msgDel: base64.del2IconColor666,
    toCurrentLocation: base64.angleRight,
    // 首页数据变量
    currentLocationName: app.globalData.currentLocationName,
    currentLocationID: app.globalData.currentLocationID,
    goodTotal: 0,
    packTotal: 0,
    parentPackName: app.globalData.parentPackName,
    parentPackID: app.globalData.parentPackID,
    // 用户是否授权公开信息
    hasUserInfo: app.globalData.hasUserInfo
  },

  onReady: function() {
    // 获得 standardLayout 组件
    this.standardLayout = this.selectComponent("#standardLayout");
  },

  // 在首页拿当前盒子的统计信息
  getIndexInfo: function(e) {
    let me = this;
    const param = {
      url: `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getUserInfo`,
      success: function(data) {
        // 将拿回来的 default_pack_name 赋值为全局的 currentLocationName
        app.globalData.currentLocationName = data.data.default_pack_name;
        app.globalData.parentPackName = data.data.default_pack_name;
        app.globalData.exParentPackName = data.data.default_pack_name;
        // 将拿回来的 default_pack 赋值为全局的 currentLocationID
        app.globalData.currentLocationID = data.data.default_pack;
        app.globalData.parentPackID = data.data.default_pack;
        app.globalData.exParentPackID = data.data.default_pack;
        me.setData({
          currentLocationName: data.data.default_pack_name,
          currentLocationID: data.data.default_pack,
          goodTotal: data.data.goodTotal,
          packTotal: data.data.packTotal,
          parentPackName: data.data.default_pack_name,
          parentPackID: data.data.default_pack,
        });
      },
      fail: ``,
      complete: ``
    };
    request.get(param);
  },

  getUserAuth: function(e) {
    // 将拿回来的 userInfo 赋值到全局的 userInfo
    app.globalData.userInfo = e.detail.userInfo;
      if (e.detail.userInfo != undefined) {
      // 将全局授权变量为已授权
      app.globalData.hasUserInfo = 1;
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
        hasUserInfo: app.globalData.hasUserInfo,
      });
    }
    console.log(`用户授权获取 TA 的公开信息`);
  },

  onShow: function() {

    this.setData({
      hasUserInfo: app.globalData.hasUserInfo
    });

    if (this.data.hasUserInfo === 1) {
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName
      });
    }

    // 展示这个页面的时候，加载用户头像的动画 class
    this.setData({
      avatarBoxClass: [`avatarBox`, `avatarBoxAnim`]
    });

    // 拿首页要显示的用户当前房屋的信息
    if (app.globalData.session_key) {
      this.getIndexInfo();
    } else {
      app.sessionkeyReadyCallback = res => {
        this.getIndexInfo();
      };
    }
  },

  onHide: function() {
    // 离开这个页面的时候，重置掉用户头像的动画 class
    this.setData({
      avatarBoxClass: [`avatarBox`]
    });
  },

  // 跳转到更改默认房屋地点
  toLocationList: function() {
    console.log(`跳转到房屋地点列表`);
    wx.navigateTo({
      url: `../changeLocation/changeLocation`
    });
  },

  // 打开帮助
  openHelp: function() {
    console.log("打开帮助");
  },

  // 跳转到搜索页面
  gotoSearchPage: function(searchType = all, pack = this.data.currentLocationName) {
    wx.navigateTo({
      url: `../search/search?type=${searchType}&pack=${pack}`
    });
  },
  toSearchPage: function() {
    console.log(`跳转到搜索页面`);
    this.gotoSearchPage("all");
  },

  // 跳转到收纳点内容列表
  intoThisLocation: function() {
    console.log(`跳转到 ${this.data.currentLocationName} 的内容列表`);
    wx.redirectTo({
      url: `../list/list?packName=${this.data.currentLocationName}&packId=${this.data.currentLocationID}`
    });
  },
});
