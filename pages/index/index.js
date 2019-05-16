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
    cleiClass: [`clei`, `anim`],
    avatarUrl: app.globalData.userInfo.avatarUrl,
    nickName: app.globalData.userInfo.nickName,
    // 图标
    msgLogo: base64.msgIconColorful,
    help: base64.helpIconColorffaa7a,
    addLocation: base64.homeIconColorful3,
    setting: base64.settingIconColorfff,
    locationEdit: base64.editIconColorfff,
    indexSearchIcon: base64.searchIconColorffaa7a,
    whatsIn: base64.homeIconColorful2,
    beChef: base64.chefIconColorb41616,
    meat: base64.meatIconColorful,
    mission: base64.missionIconColorb41616,
    msg: base64.msgIconColorful,
    finger: base64.fingerIconColor666,
    msgDel: base64.del2IconColor666,
    toCurrentLocation: base64.angleRight,
    // 首页数据
    currentLocationName: app.globalData.currentLocationName,
    currentLocationID: app.globalData.currentLocationID,
    goodTotal: 0,
    packTotal: 0,
    parentPackName: app.globalData.parentPackName,
    parentPackID: app.globalData.parentPackID,
    // 用户是否授权公开信息
    hasUserInfo: app.globalData.hasUserInfo,
    // 最近编辑
    newModify: [],
    // 信息列表
    // msList: [],
    msgList: [
      {
        itemName: '测试物品测试物品测试物品测试物品测试物品测试物品测试物',
        item_create_date: '2019-05-14 16:09:50',
        itemId: '1',
        expire_date: '2019-12-18',
        msgId: '5',
        msg_create_time: '2019-05-12',
        cook_book: null,
        cook_book_url: null,
      },
      {
        itemName: '测试物品B',
        item_create_date: '2019-05-14 16:10:26',
        itemId: '2',
        expire_date: '2019-10-01',
        msgId: '4',
        msg_create_time: '2019-05-12',
        cook_book: null,
        cook_book_url: null,
      },
      {
        itemName: '快过期食物A',
        item_create_date: '2019-05-14 18:56:21',
        itemId: '4',
        expire_date: '2019-05-19',
        msgId: '3',
        msg_create_time: '2019-05-12',
        cook_book: '比较长的食谱名称不代表食材多',
        cook_book_url: null,
      },
      {
        itemName: '测试物品C',
        item_create_date: '2019-05-14 16:10:48',
        itemId: '3',
        expire_date: '2019-05-10',
        msgId: '2',
        msg_create_time: '2019-05-10',
        cook_book: null,
        cook_book_url: null,
      },
      {
        itemName: '快过期食物B',
        item_create_date: '2019-05-14 19:00:22',
        itemId: '5',
        expire_date: '2019-05-15',
        msgId: '1',
        msg_create_time: '2019-05-09',
        cook_book: '好不好吃靠照骗',
        cook_book_url: null,
      },
    ],
  },

  onReady: function() {
    // 获得组件
    this.standardLayout = this.selectComponent("#standardLayout");
    this.msgList = this.selectComponent("#msgList");
  },

  _toMsgList: function() {
    wx.navigateTo({
      url: `../msg/msg`
    });
  },

  // 进入最近编辑
  entrynewModify: function(e) {
    const type = e.currentTarget.dataset.type;
    const id = e.currentTarget.dataset.id;
    switch (type) {
      case 'package':
        wx.navigateTo({
          url: `../editBox/editBox?packId=${id}`
        });
        break;
      case 'good':
        wx.navigateTo({
          url: `../editItem/editItem?itemId=${id}`
        });
        break;
      default:;
    }
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

  // 获取最近编辑
  getNew: function(e) {
    let me = this;
    const param = {
      url: `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getNewest`,
      success: function(data) {
        me.setData({
          newModify: data.data.list,
        });
      },
      fail: function () {
        wx.showModal({
          title: `获取最近编辑失败`,
          content: `爸爸快检查网络是否正常`,
          confirmText: `好的`,
          showCancel: false
        });
      },
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
      cleiClass: [`clei`, `anim`]
    });

    // 拿首页要显示的用户当前房屋的信息
    if (app.globalData.session_key) {
      this.getIndexInfo();
      this.getNew();
    } else {
      app.sessionkeyReadyCallback = res => {
        this.getIndexInfo();
        this.getNew();
      };
    }
  },

  onHide: function() {
    // 离开这个页面的时候，重置掉用户头像的动画 class
    this.setData({
      cleiClass: [`clei`]
    });
  },

  // 跳转到更改默认房屋地点
  toLocationList: function() {
    wx.navigateTo({
      url: `../changeLocation/changeLocation`
    });
  },

  // 打开帮助
  openHelp: function() {
    wx.navigateTo({
      url: `../help/help`
    });
  },

  // 跳转到搜索页面
  gotoSearchPage: function() {
    wx.navigateTo({
      url: `../search/search`
    });
  },

  toSearchPage: function() {
    this.gotoSearchPage();
  },

  // 跳转到收纳点内容列表
  intoThisLocation: function() {
    wx.redirectTo({
      url: `../list/list?packName=${this.data.currentLocationName}&packId=${this.data.currentLocationID}`
    });
  },
});
