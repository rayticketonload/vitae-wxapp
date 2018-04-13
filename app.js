// ------------------
// app.js
// ------------------
// base64资源
const base64 = require('./base64/base64');
// 引入工具
const login = require('./utils/login');

App({

  onLaunch: function() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },

  onShow: function() {
    // 验证登录状态
    if (this.globalData.isLogin === 0) {
      console.log(`%c用户非登录状态，现在开始登录`,`color: #f17c6b;`);
      login.login();
    } else if (this.globalData.isLogin === 1) {
      console.log(`%c用户已登录，无需执行登录逻辑`,`color: #5dd396;`);
    }
  },

  onHide: function() {
    // 小程序转入后台运行的同时将用户登录状态改变为未登录，当小程序再次转向前台的时候将会再次执行登录逻辑
    this.globalData.isLogin = 0;
    console.log(`isLogin onHide`, this.globalData.isLogin);
  },

  globalData: {
    // 用户是否登录状态 0 = 未登录，1 = 已登录
    isLogin: 0,
    // 是否有用户微信公开信息 0 = 没有，1 = 有
    hasUserInfo: 0,
    // 从微信拿来的用户公开信息
    userInfo: {
      avatarUrl: base64.defaultAvatar,
      city: `用户未授权获取其公开信息`,
      country: `用户未授权获取其公开信息`,
      gender: `用户未授权获取其公开信息`,
      language: `用户未授权获取其公开信息`,
      nickName: `用户未授权获取其公开信息`,
      province: `用户未授权获取其公开信息`
    },
    // 最终合成的 session_key
    session_key: null,
    // 用户当前的房屋地点名称
    currentPackName: `默认房屋地点名称`,
    // 用户当前的房屋地点ID
    currentPackID: ``,
    // 用户当前的房屋地点的物品总数
    currentItemTotal: 0,
    // 用户当前的房屋地点的收纳点总数
    currentPackTotal: 0,
  },
})
