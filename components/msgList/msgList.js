// 获取应用实例
const app = getApp();
// 引入封装好的请求方法
const request = require('../../utils/request');
// 引入常量
const constants = require("../../constants/constants");
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
    msgList: {
      type: Array,
      value: [],
    },
    extraClass: {
      type: String,
      value: '',
    },
    quantity: {
      type: Number,
      value: null,
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    noDataMsg: base64.nodataMsg,
    msgDel: base64.del2IconColor666,
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    // 从信息进入物品编辑界面
    msgToItem: function(e) {
      let me = this;
      request.post(
        constants.API.getGoodInfoById,
        {
          id: e.currentTarget.dataset.id,
        },
        // 获取物品信息成功
        function (res) {
          // 这段逻辑是用来判断从信息跳转过来的时候，用物品ID和物品创建时间来判断物品是否还存在
          if (e.currentTarget.dataset.createtime == res.data.date && e.currentTarget.dataset.id == res.data.id) {
            wx.navigateTo({
              url: constants.ROUTE.editItem(e.currentTarget.dataset.id),
            });
          } else {
            wx.showToast({
              title: `物品已经不存在`,
              icon: `none`,
              duration: 2000,
            });
          }
        },
        // 获取收纳点信息失败
        function (err) {
          wx.showModal({
            title: `获取物品信息失败`,
            content: `爸爸快检查网络是否正常`,
            confirmText: `好的`,
            showCancel: false
          });
        }
      )
    },
  }
})
