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
    console.log(`%c前端业务待修改:`,`color: red;`);
    console.log(`toDo: %c表单初始值都要从 data 渲染`,`color: #4492d4;`);
    console.log(`toDo: %c用户不授权会进入死循环`,`color: #4492d4;`);
    // console.log(`toDoList: %c把过期提醒模块做到首页`,`color: #4492d4;`);
    console.log(`toDo: %c表单校验要做`,`color: #4492d4;`);
    console.log(`toDo: %c统一管理所有跳转url`,`color: #4492d4;`);
    console.log(`toDo: %c添加地点名称重名的用户提示`,`color: #4492d4;`);
    // console.log(`toDoList: %c清一下没用的图标`,`color: #4492d4;`);
    // console.log(`toDoList: %c删除地点，如果删除的是默认地点，就帮用户重新选一个默认地点（数组第一个）`,`color: #4492d4;`);
    console.log(`toDo: %c所有 request 都要有 loading, 和独立提示成功时候的 we.showToast 反馈，失败时候的 wx.showModal 反馈`,`color: #4492d4;`);
    console.log(`toDo: %csession_key 过期需要帮用户重新登录`,`color: #4492d4;`);
    // console.log(`toDoList: %c房屋地点列表 title 要改`,`color: #4492d4;`);
    // console.log(`toDoList: %c添加地点成功之后要跳转到新地点里面`,`color: #4492d4;`);


    console.log(`%cAPI待修改:`,`color: red;`);
    console.log(`toDo: mini/api/getNewest : %c不用返回顶级节点，例如初始数据的‘家’，‘仓库’，‘公司’`,`color: #4492d4;`);
    console.log(`toDo: %c需要一个新接口，前端传盒子ID给服务器，服务器屏蔽所传ID的盒子及其下所有盒子，并返回剔除掉这些盒子之后的结果数组`,`color: #4492d4;`);
    console.log(`toDo: mini/api/getGoodInfoById : %c需要返回’物品数量‘`,`color: #4492d4;`);
    console.log(``);
    console.log(``);


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
    currentLocationName: `默认房屋地点名称`,
    // 用户当前的房屋地点ID
    currentLocationID: ``,
    // 为添加物品或者收纳点的时候设定的父级收纳点ID
    parentPackID: ``,
    // 为添加物品或者收纳点的时候设定的父级收纳点名称
    parentPackName: ``,
  },
})
