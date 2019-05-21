// 获取应用实例
const app = getApp();
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');
// 引入 base64 资源
const base64 = require('../../base64/base64');


Page({
  // 页面的初始数据
  data: {
    // 图标
    folder: base64.folderColorful,
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
  }
})
