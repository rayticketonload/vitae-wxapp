// 获取应用实例
const app = getApp();
// base64资源
const base64 = require('../../base64/base64');
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');

Page({

  data: {
    avatarBoxClass: [
      `avatarBox`,
      `avatarBoxAnim`
    ],
    avatarUrl: app.globalData.userInfo.avatarUrl,
    changeLocation: base64.changeLocation,
    indexSearchIcon: base64.searcherIcon,
    currentPackName: app.globalData.currentPackName,
    currentItemTotal: app.globalData.currentItemTotal,
    currentPackTotal: app.globalData.currentPackTotal,
    nickName: app.globalData.userInfo.nickName
  },

  onReady: function () {
    // 获得 standardLayout 组件
    this.standardLayout = this.selectComponent("#standardLayout");
  },

  // 在首页拿当前盒子的统计信息
  getIndexInfo: function(e) {
    let me = this;
    const param = {
      "url": `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getUserInfo`,
      "success": function(data) {
        // 将拿回来的 default_pack_name 赋值为全局的 currentPackName
        app.globalData.currentPackName = data.data.default_pack_name;
        // 将拿回来的 default_pack 赋值为全局的 currentPackID
        app.globalData.currentPackID = data.data.default_pack;
        // 将拿回来的 goodTotal 赋值为全局的 currentItemTotal
        app.globalData.currentItemTotal = data.data.goodTotal;
        // 将拿回来的 packTotal 赋值为全局的 currentPackTotal
        app.globalData.currentPackTotal = data.data.packTotal;
        me.setData({
          currentPackName: data.data.default_pack_name,
          currentItemTotal: app.globalData.currentItemTotal,
          currentPackTotal: app.globalData.currentPackTotal,
        })
      },
      "fail": ``,
      "complete": ``
    }
    request.get(param)
  },

  onShow: function () {
    if (app.globalData.hasUserInfo === 0) {
      // 获取用户授权拿 TA 的公开信息
      wx.getSetting({
        // 访问 wx.getSetting 会返回的数据里有一个用户公开信息授权属性 authSetting[`scope.userInfo`]
        // authSetting[`scope.userInfo`] 为 undefined 的时候，调用 wx.getUserInfo 则会弹窗请求用户确认授权获取公开信息
        // authSetting[`scope.userInfo`] 为 true 的时候，调用 wx.getUserInfo 则会直接绕过弹窗交互，直接获取用户公开信息
        success: res => {
          console.log(`用户公开信息授权属性 scope.userInfo 为 %c${res.authSetting[`scope.userInfo`]}`, `color: #ffb119;`);
          // 获取用户授权拿TA的公开信息
          wx.getUserInfo({
            success: res => {
              // 将拿回来的 userInfo 赋值到全局的 userInfo
              app.globalData.userInfo = res.userInfo;
              // 将全局授权变量为已授权
              app.globalData.hasUserInfo = 1;
              this.setData({
                avatarUrl: app.globalData.userInfo.avatarUrl,
                nickName: app.globalData.userInfo.nickName
              });
              console.log(`用户授权获取 TA 的公开信息`);
            },
            fail: res => {
              console.log('用户拒绝授权获取 TA 的公开信息');
              wx.navigateBack({
                delta: 0
              });
            }
          })
        }
      })
    } else if (app.globalData.hasUserInfo === 1) {
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName
      });
    }

    // 展示这个页面的时候，加载用户头像的动画 class
    this.setData({
      avatarBoxClass: [
        `avatarBox`,
        `avatarBoxAnim`
      ]
    });

    // 拿首页要显示的用户当前房屋的信息
    this.getIndexInfo();
  },

  onHide: function () {
    // 离开这个页面的时候，重置掉用户头像的动画 class
    this.setData({
      avatarBoxClass: [
        `avatarBox`
      ],
    })
  },

  // 跳转到更改默认房屋地点
  toChangeLocation: function () {
    console.log('跳转到更改默认房屋地点');
    wx.navigateTo({
      url: `../changeLocation/changeLocation`
    });
  },

  // 跳转到搜索页面
  toSearchPage: function() {
    console.log('跳转到搜索页面');
  },

  // 跳转到物品总数页面
  toItemTotal: function() {
    console.log('跳转到物品总数页面');
  },

  // 跳转到收纳点总数页面
  toPackTotal: function() {
    console.log('跳转到收纳点总数页面');
  }
})
