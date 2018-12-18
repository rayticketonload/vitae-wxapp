// 获取应用实例
const app = getApp();
// 引入常量
const constants = require("../../constants/constants");
// 引入封装好的请求方法
const request = require("../../utils/request");
// 引入 moment 时间戳编译
const moment = require("../../utils/moment");
// 引入 base64 资源
const base64 = require('../../base64/base64');


Page({
  data: {
    // 搜用户当前的房屋
    currentLocationID: null,
    // 搜索框相关
    searchValue: null,
    searchIcon: base64.searchIconColorffaa7a,
    // 搜索结果
    packList: [],
    goodList: [],
    // 搜索结果 tab
    packTabName: '收纳点',
    goodTabName: '物品',
    packListChecked: false,
    goodListChecked: false,
    checked: null,
    // fileServer
    serverName: `${constants.NP}${constants.APIDOMAIN}`
  },

  onReady: function() {
    // 获得 standardLayout 组件
    this.standardLayout = this.selectComponent("#standardLayout");
  },

  radioChange: function(e) {
    this.setData({
      checked: e.detail.value
    });
    switch (e.detail.value) {
      case this.data.packTabName:
        this.setData({
          packListChecked: true,
          goodListChecked: false,
        });
        break;
      case this.data.goodTabName:
        this.setData({
          packListChecked: false,
          goodListChecked: true,
        });
        break;
        default:
    }
  },

  // 搜索 key 输入
  searchValueKeyIn: function(e) {
    this.setData({
      searchValue: e.detail.value,
    });
  },

  // 搜索 key 重置
  searchValueReset: function() {
    this.setData({
      searchValue: null
    });
  },

  searchSubmit: function(e) {
    let me = this;
    console.log(this.data.currentLocationID);
    // 提交搜索 key
    const KEY = e.detail.value;
    request.post(
      `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}search`,
      {
        key: KEY,
        id: me.data.currentLocationID,
      },
      // 搜索成功
      function (res) {
        switch (res.code) {
          case 100:
            wx.showToast({
              title: `${res.msg}`,
              icon: 'none',
              duration: 2000
            });
            break;
          case 200:
            wx.showToast({
              title: `搜索完成`,
              duration: 1000
            });
            me.setData({
              packList: res.data.packList,
              goodList: res.data.goodList,
            });
            break;
        }
      },
      // 搜索失败
      function (err) {
        console.log('搜索失败', err);
        wx.showModal({
          title: `搜索失败`,
          content: `爸爸快检查网络是否正常`,
          confirmText: `好的`,
          showCancel: false
        });
      }
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      checked: this.data.packTabName,
      packListChecked: true,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      currentLocationID: app.globalData.currentLocationID,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
