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
    fakseList: [
        {
            "_id":"5d271553b079d27ce7964a83",
            "cook_book": '123',
            "cook_book_url":null,
            "del":false,
            "msg_create_time":"2019-07-11 18:54:11",
            "item_id":"39",
            "item_name":"测试物品信息1",
            "item_create_date":"2019-07-11 10:36:41",
            "item_expire_date":"2019-07-12",
            "item_remind_date":"2019-07-11",
            "item_current_location_name":"屋企",
            "item_current_location_id":"1"
        },
        {
            "_id":"5d271553b079d27ce7964a84",
            "cook_book": '1234',
            "cook_book_url":null,
            "del":false,
            "msg_create_time":"2019-07-11 18:54:11",
            "item_id":"44",
            "item_name":"测试物品信息office1",
            "item_create_date":"2019-07-11 17:36:14",
            "item_expire_date":"2019-07-11",
            "item_remind_date":null,
            "item_current_location_name":"Office",
            "item_current_location_id":"2"
        },
        {
            "_id":"5d271553b079d27ce7964a85",
            "cook_book":null,
            "cook_book_url":null,
            "del":false,
            "msg_create_time":"2019-07-11 18:54:11",
            "item_id":"45",
            "item_name":"测试物品信息2",
            "item_create_date":"2019-07-11 17:48:47",
            "item_expire_date":"2019-07-12",
            "item_remind_date":"2019-07-11",
            "item_current_location_name":"屋企",
            "item_current_location_id":"1"
        }
    ]
  },

  // 获取信息列表并刷新 sessionStorage 里面存储的信息数统计，为的是判断用户有没有新信息
  msgs: function() {
    let me = this;
    request.get(
      constants.API.msg,
      // 请求成功
      function (res) {
        me.setData({
          msgList: res.msg_list,
          // msgList: me.data.fakseList,
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
