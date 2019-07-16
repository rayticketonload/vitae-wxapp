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
    multipleSlots: true,
  },

  data: {
    localMsgQty: null,
    serverMsgQty: null,
    haveNewMsg: false,
  },

  methods: {
    getServerMsgQty: function() {
      let me = this;
      request.get(
        constants.API.msg,
        // 请求成功
        function (res) {
          me.setData({
            serverMsgQty: res.msg_list.length,
          });
          // console.log('serverMsgQty', me.data.serverMsgQty);
          // console.log('localMsgQty', me.data.localMsgQty);
          if (me.data.serverMsgQty > me.data.localMsgQty) {
            me.setData({
              haveNewMsg: true,
            });
          } else {
            me.setData({
              haveNewMsg: false,
            });
          }
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

    getLocalMsgQty: function() {
      let me = this;
      wx.getStorage({
        key: constants.MSG_QTY_HISTORY_KEY,
        success(res) {
          me.setData({
            localMsgQty: res.data,
          });
          me.getServerMsgQty();
        },
        fail(e) {
          wx.setStorage({
            key: constants.MSG_QTY_HISTORY_KEY,
            data: 0,
          });
          me.setData({
            localMsgQty: 0,
          });
        },
      });
    },
  },

  pageLifetimes: {
    show() {
      if (app.globalData.session_key) {
        this.getLocalMsgQty();
      } else {
        app.sessionkeyReadyCallbackInStandardLayout = res => {
          this.getLocalMsgQty();
        };
      };
    },
  },
});
