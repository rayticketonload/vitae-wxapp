// 获取应用实例
const app = getApp();
// 引入常量
const constants = require("../../constants/constants");
// 引入封装好的请求方法
const request = require("../../utils/request");
// 引入 base64 资源
const base64 = require("../../base64/base64");

Component({
  options: {
    multipleSlots: true
  },

  properties: {
    currentLocationName: {
      type: String,
      value: app.globalData.currentLocationName,
    },

    relative: {
      type: Boolean,
      value: true,
    }
  },

  data: {
    help: base64.helpIconColorffaa7a,
    addLocation: base64.homeIconColorful3,
    indexSearchIcon: base64.searchIconColorffaa7a,
  },

  methods: {
    // 跳转到搜索页面
  gotoSearchPage: function() {
    wx.navigateTo({
      url: constants.ROUTE.search,
    });
  },

  toSearchPage: function() {
    this.gotoSearchPage();
  },

    // 跳转到更改默认房屋地点
  toLocationList: function() {
    wx.navigateTo({
      url: constants.ROUTE.changeLocation,
    });
  },

    // 打开帮助
    openHelp: function() {
      wx.navigateTo({
        url: constants.ROUTE.help
      });
    }
  }
});
