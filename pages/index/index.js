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
    avatarUrl: base64.defaultAvatar,
    changeLocation: base64.changeLocation,
    indexSearchIcon: base64.searcherIcon,
    nickName: '用户未授权获取昵称',
    hasUserInfo: false
  },

  onReady: function () {
    // 获得 standardLayout 组件
    this.standardLayout = this.selectComponent("#standardLayout");
  },

  getIndexInfo: function(e) {
    const param = {
      "url": `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getUserInfo`,
      "data": ``,
      "success": ``,
      "fail": ``,
      "complete": ``
    }
    request.get(param);
  },

  onLoad: function () {
    // 使用 wx.getSetting 访问微信服务器确认小程序之前是否已经申请过获取用户公开信息的授权
    wx.getSetting({
      // 访问成功后，如果返回的数据里 scope.userInfo（公开信息）不存在则重新获取用户授权
      success: res => {
        if (res.authSetting['scope.userInfo'] == undefined) {
          console.log(`用户并未授权获取 TA 的公开信息，权限属性 scope.userInfo: %c${res.authSetting[`scope.userInfo`]}`,`color: #ffb119; background-color: transparent;`);
          // 获取用户授权拿TA的公开信息
          wx.getUserInfo({
            fail: res => {
              console.log('用户拒绝授权获取 TA 的公开信息');
            },
            success: res => {
              // 将全局的 userInfo 赋值为刚拿回来的 userInfo
              app.globalData.userInfo = res.userInfo;
              console.log('app.globalData.userInfo', app.globalData.userInfo);
              console.log('app.globalData.session_key', app.globalData.session_key);
              // 获取授权成功后再打印一下授权列表确认
              wx.getSetting({
                success: res => {
                  console.log(`好了，用户授权获取 TA 的公开信息，权限属性 scope.userInfo: %c${res.authSetting[`scope.userInfo`]}`,`color: #ffb119; background-color: transparent;`);
                }
              });
              wx.hideLoading();
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                hasUserInfo: true
              });
              // 拿首页要显示的用户信息
              this.getIndexInfo();
            }
          })
        }
        else if (res.authSetting['scope.userInfo'] == true) {
          wx.hideLoading();
          this.setData({
            avatarUrl: app.globalData.userInfo.avatarUrl,
            nickName: app.globalData.userInfo.nickName,
            hasUserInfo: true
          });
          // 拿首页要显示的用户信息
          this.getIndexInfo();
          console.log(`用户已经授权获取 TA 的公开信息，权限属性 scope.userInfo: %c${res.authSetting[`scope.userInfo`]}`,`color: #ffb119; background-color: transparent;`);
        }
      }
    })
  },

  // 展示这个页面的时候，加载用户头像的动画 class
  onShow: function () {
    this.setData({
      avatarBoxClass: [
        `avatarBox`,
        `avatarBoxAnim`
      ],
    })
  },

  // 离开这个页面的时候，重置掉用户头像的动画 class
  onHide: function () {
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
  }
})
