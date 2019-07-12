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
      const currentLocationID = e.currentTarget.dataset.cli;
      const currentLocationName = e.currentTarget.dataset.cln;

      request.post(
        constants.API.getGoodInfoById,
        {
          id: e.currentTarget.dataset.id,
        },
        // 访问物品信息成功
        function (res) {
          if (res.code == 100) {
            wx.showToast({
              title: `物品已经不存在`,
              icon: `none`,
              duration: 2000,
            });
          } else {
            // 如果物品不在当前地点
            if (currentLocationID != app.globalData.currentLocationID) {
              wx.showModal({
                title: `物品不在当前地点`,
                content: `将跳转到 ${currentLocationName}`,
                confirmText: '跳转',
                confirmColor: '#f17c6b',
                success: function (res) {
                  if (res.confirm) {
                    // 先改变当前地点ID
                    request.post(
                      constants.API.modifyDefaultPack,
                      {
                        id: currentLocationID,
                      },
                      // success
                      function (res) {
                        switch (res.code) {
                          case 100:
                            wx.showToast({
                              title: `${res.msg}`,
                              icon: 'none',
                              duration: 3000,
                            });
                            break;
                          case 200:
                            // 改变成功后再跳转
                            app.globalData.currentLocationID = currentLocationID;
                            app.globalData.currentLocationName = currentLocationName;
                            wx.navigateTo({
                              url: constants.ROUTE.editItem(e.currentTarget.dataset.id),
                            });
                            break;
                        }
                      },
                      // fail
                      function (err) {
                        wx.showModal({
                          title: `跳转失败`,
                          content: `爸爸快检查网络是否正常`,
                          confirmText: `好的`,
                          showCancel: false
                        });
                      }
                    );
                  }
                }
              });
            } else {
              // 物品在当前地点
              wx.navigateTo({
                url: constants.ROUTE.editItem(e.currentTarget.dataset.id),
              });
            }
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

    // 删除信息
    msgDel: function(e) {
      let me = this;
      // 弹窗确认删除
      wx.showModal({
        title: `删除此信息`,
        content: '删除后将无法恢复',
        confirmText: '确认删除',
        confirmColor: '#f17c6b',
        success: function (res) {
          if (res.confirm) {
            // 请求删除
            request.post(
              constants.API.deleteMsgById,
              {
                id: e.currentTarget.dataset.msgid,
              },
              // 请求成功
              function(res) {
                wx.showToast({
                  title: `删除成功`,
                  duration: 2000,
                });
                me.triggerEvent(
                  'delMsg',
                  {
                    value: true,
                  },
                );
              },
              // 请求失败
              function(err) {
                wx.showModal({
                  title: `删除失败`,
                  content: `爸爸快检查网络是否正常`,
                  confirmText: `好的`,
                  showCancel: false
                });
              }
            );
          }
        }
      });
    },
  }
})
