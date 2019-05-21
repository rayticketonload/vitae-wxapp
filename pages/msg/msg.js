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
    // msList: [],
    msgList: [
      {
        itemName: '测试物品测试物品测试物品测试物品测试物品测试物品测试物',
        item_create_date: '2019-05-14 16:09:50',
        itemId: '1',
        expire_date: '2019-12-18',
        msgId: '5',
        msg_create_time: '2019-05-12',
        cook_book: null,
        cook_book_url: null,
      },
      {
        itemName: '测试物品B',
        item_create_date: '2019-05-14 16:10:26',
        itemId: '2',
        expire_date: '2019-10-01',
        msgId: '4',
        msg_create_time: '2019-05-12',
        cook_book: null,
        cook_book_url: null,
      },
      {
        itemName: '快过期食物A',
        item_create_date: '2019-05-14 18:56:21',
        itemId: '4',
        expire_date: '2019-05-19',
        msgId: '3',
        msg_create_time: '2019-05-12',
        cook_book: '比较长的食谱名称不代表食材多',
        cook_book_url: null,
      },
      {
        itemName: '测试物品C',
        item_create_date: '2019-05-14 16:10:48',
        itemId: '3',
        expire_date: '2019-05-10',
        msgId: '2',
        msg_create_time: '2019-05-10',
        cook_book: null,
        cook_book_url: null,
      },
      {
        itemName: '快过期食物B',
        item_create_date: '2019-05-14 19:00:22',
        itemId: '5',
        expire_date: '2019-05-15',
        msgId: '1',
        msg_create_time: '2019-05-09',
        cook_book: '好不好吃靠照骗',
        cook_book_url: null,
      },
    ],
  },

  // 获取信息列表并刷新 sessionStorage 里面存储的信息数统计，为的是判断用户有没有新信息
  msgs: function() {
    request.post(
      constants.API.getPAGListById,
      {
        id: 1,
      },
      // 请求成功
      function (res) {
        wx.setStorage({
          key: constants.MSG_QTY_HISTORY_KEY,
          data: res.data.packList.length,
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
