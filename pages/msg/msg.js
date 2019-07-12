// 获取应用实例
const app = getApp();
// 获取页面栈
const pages = getCurrentPages();
// 引入常量
const constants = require("../../constants/constants");
// 引入封装好的请求方法
const request = require("../../utils/request");

Page({
  data: {
    msgList: [],
    nothing: true,
  },

  // 获取信息列表并刷新 sessionStorage 里面存储的信息数统计，为的是判断用户有没有新信息
  msgs: function() {
    let me = this;
    request.get(
      constants.API.msg,
      // 请求成功
      function (res) {
        let n = true;
        res.msg_list.some(item => {
          if (!item.del) {
            n = false;
          }
        });
        me.setData({
          msgList: res.msg_list.reverse(),
          nothing: n,
        });
        wx.setStorage({
          key: constants.MSG_QTY_HISTORY_KEY,
          data: res.msg_list.length,
        });
      },
      // 请求失败
      function (err) {
        wx.showModal({
          title: `获取信息失败`,
          content: `爸爸快检查网络是否正常`,
          confirmText: `好的`,
          showCancel: false
        });
      }
    )
  },

  // 删除信息
  deleteMsg: function(e) {
    if (e.detail.value) {
      this.msgs();
    };
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.msgs();
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {
    // 获得组件
    this.msgList = this.selectComponent("#msgList");
  },
});
