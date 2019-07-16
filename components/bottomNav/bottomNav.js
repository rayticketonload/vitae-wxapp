// 获取应用实例
const app = getApp();
// 引入常量
const constants = require("../../constants/constants");
// 引入封装好的请求方法
const request = require("../../utils/request");
// 引入 base64 资源
const base64 = require('../../base64/base64');

Component({

  // 允许组件使用多 slot 模式
  // slot 是一个承载组件使用者提供的 wxml 标签的组件标签
  options: {
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    haveNew: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 导航图标
    addItemIcon: base64.heartIconColorfff,
    addBoxIcon: base64.boxIconColorfff,
    toIndex: base64.homeIconColorfff,
    toMsg: base64.bellIcon2Colorfff,
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {

    // 回到首页
    _toIndex(e) {
      wx.reLaunch({
        url: constants.ROUTE.index,
      });
    },

    // 跳转到添加物品表单页面
    _navToAddItem() {
      wx.navigateTo({
        url: constants.ROUTE.addItem(app.globalData.parentPackID, app.globalData.parentPackName),
      });
    },

    // 跳转到添加收纳盒表单页面
    _navToAddBox() {
      wx.navigateTo({
        url: constants.ROUTE.addBox(app.globalData.parentPackID, app.globalData.parentPackName),
      });
    },

    // 跳转到消息页面
    _toMsg() {
      wx.navigateTo({
        url: constants.ROUTE.msg,
      });
    },
  },
})
