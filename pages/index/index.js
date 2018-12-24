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
    // 首页数据变量
    currentLocationName: app.globalData.currentLocationName,
    currentLocationID: app.globalData.currentLocationID,
    goodTotal: 0,
    packTotal: 0,
    parentPackName: app.globalData.parentPackName,
    parentPackID: app.globalData.parentPackID,
    // 用户是否授权公开信息
    hasUserInfo: app.globalData.hasUserInfo,
    // 最近编辑
    newModify: [
      {
        name: '主卧室',
        type: 'pack',
        id: '12',
        img: '/user/photo/g3LL4nBS9Yu5X3IyNqiKTtXOXGOy0uzw.jpeg',
        ppid: '10',
        ppname: '屋企屋企屋企屋企屋企',
      },
      {
        name: '厨房',
        type: 'pack',
        id: '11',
        img: '/user/photo/ZKN2zjA5yxXznC3qwO0OJkcHOvBDyv3q.jpeg',
        ppid: '10',
        ppname: '屋企屋企屋企屋企屋企',
      },
      {
        name: '小猪佩奇玩具',
        type: 'good',
        id: '4',
        img: [],
        ppid: '12',
        ppname: '主卧室',
      },
      {
        name: '打蛋器',
        type: 'good',
        id: '5',
        img: '/user/photo/kTarQMuPZDl0VkEXKAY8gAfRIXU24Dia.jpeg',
        ppid: '11',
        ppname: '厨房',
      },
      {
        name: '橱柜上层第一格',
        type: 'pack',
        id: '15',
        img: '/user/photo/TDPY9Vc5iRejEBed1BdYMylAQ9dtEdnA.jpeg',
        ppid: '11',
        ppname: '厨房',
      },
      {
        name: 'xBox',
        type: 'good',
        id: '6',
        img: '/user/photo/pJAtSPPmZuF9oXvI6x2sT6dPaYuJ6ecC.jpeg',
        ppid: '10',
        ppname: '屋企屋企屋企屋企屋企',
      }
    ],
  },

  onReady: function() {
    // 获得 standardLayout 组件
    this.standardLayout = this.selectComponent("#standardLayout");
  },

  // 进入最近编辑
  entrynewModify: function(e) {
    const name = e.currentTarget.dataset.name;
    const type = e.currentTarget.dataset.type;
    const id = e.currentTarget.dataset.id;
    const img = e.currentTarget.dataset.img;
    const pic = e.currentTarget.dataset.img;
    const ppid = e.currentTarget.dataset.ppid;
    const ppname = e.currentTarget.dataset.ppname;
    const expire = e.currentTarget.dataset.expire;
    const quantity = e.currentTarget.dataset.quantity;
    switch (type) {
      case 'package':
        wx.navigateTo({
          url: `../editBox/editBox?packId=${id}&packName=${name}&parentPackId=${ppid}&parentPackName=${ppname}&packImg=${img}`
        });
        break;
      case 'good':
        wx.navigateTo({
          url: `../editItem/editItem?itemId=${id}&itemName=${name}&parentPackId=${ppid}&parentPackName=${ppname}&itemImg=${pic}&quantity=${quantity}&expire=${expire}`
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
    console.log(`跳转到房屋地点列表`);
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
    console.log(`跳转到搜索页面`);
    this.gotoSearchPage();
  },

  // 跳转到收纳点内容列表
  intoThisLocation: function() {
    console.log(`跳转到 ${this.data.currentLocationName} 的内容列表`);
    wx.redirectTo({
      url: `../list/list?packName=${this.data.currentLocationName}&packId=${this.data.currentLocationID}`
    });
  },
});
