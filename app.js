// ------------------
// app.js
// ------------------
// base64资源
const base64 = require('./base64/base64');
// 引入工具
const login = require('./utils/login');
// 引入表单验证
import validator from './utils/validators'

App({

  // 实例化表单验证插件
  validator: (rules, messages) => new validator(rules, messages),

  onLaunch: function() {
    // toDo
    console.log(`toDoList: %c表单初始值都要从 data 渲染`,`color: #4492d4;`);
    console.log(`toDoList: %c用户不授权会进入死循环`,`color: #4492d4;`);
    //console.log(`toDoList: %c删除地点，如果删除的是默认地点，就帮用户重新选一个默认地点（数组第一个）`,`color: #4492d4;`);
    console.log(`toDoList: %c所有 request 都要有 loading, 和独立提示成功时候的 we.showToast 反馈，失败时候的 wx.showModal 反馈`,`color: #4492d4;`);
    console.log(`toDoList: %c底部导航打开状态下跳转房屋地点列表，再返回来，导航还是打开状态`,`color: #4492d4;`);
    console.log(`toDoList: %c房屋地点列表 title 要改`,`color: #4492d4;`);
    console.log(`toDoList: %c添加地点成功之后要跳转到地点里面`,`color: #4492d4;`);
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
    //this.globalData.isLogin = 0;
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
