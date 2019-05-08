// 获取应用实例
const app = getApp();
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');
// 引入表单验证规则
import customValidatorRule from '../../utils/validatorsRules';

Page({

  // 页面的初始数据
  data: {
    locationId: null,
    parentId: null,
    // 地点名称输入框初始数据
    locationName: `locationName`,
    locationLabel: `地点名称`,
    locationPlaceholder: `例如：家，公司，仓库...`,
    locationValue: ``,
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 从 URL 拿传过来的房屋地点ID和名称
    this.setData({
      locationId: options.locationId,
      locationValue: options.locationName,
    });
    // 初始化表单验证
    // 验证规则
    const vr = {
      locationName: {
        required: true,
        //locationNameNoBlank: true
      }
    };
    // 验证返回信息
    const vm = {
      locationName: {
        required: `爸爸，要填名称的`
      }
    };
    this.validator = app.validator (vr, vm);

    // 自定义表单校验规则
    // 地点名称不能有空格
    // this.validator.addMethod('locationNameNoBlank', (value, param) => {
    //   console.log(`value`, value);
    //   return this.validator.optional(value) || customValidatorRule.noBlank.test(value);
    // }, '地点名称不能有空格');
  },

  // 地点名称正在输入
  locationValueKeyIn: function(e) {
    this.setData({
      locationValue: e.detail.value
    });
  },

  // 地点名称重置
  locationValueReset: function() {
    this.setData({
      locationValue: ``
    });
  },

  // 表单提交
  formSubmit: function(e) {
    let me = this;
    // 提交错误描述
    if (!me.validator.checkForm(e)) {
      const error = me.validator.errorList[0];
      wx.showToast({
        title: `${error.msg}`,
        icon: `none`,
        duration: 3000
      });
      return false;
    } else {
      const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}updataPackInfoById`;
      let data = {
        id: me.data.locationId,
        name: e.detail.value.locationName,
        parentId: me.data.parentId
      };
      request.post(
        url,
        data,
        // 修改地点名称成功
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
              // 然后将新地点改为当前使用地点
              const modifyDefaultPackAPI = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}modifyDefaultPack`;
              const newLocationId = me.data.locationId;
              // 同时改变 globalData 里面 currentLocationID
              app.globalData.currentLocationID = newLocationId;
              app.globalData.parentPackID = newLocationId;
              // 请求改变当前使用地点
              request.post(
                modifyDefaultPackAPI,
                { id: newLocationId },
                // 改变当前使用地点成功
                function (success) {
                  wx.showToast({
                    title: `修改成功`,
                    duration: 1000
                  });
                  const setTimeoutFun = () => {
                    wx.navigateBack({
                      delta: 2
                    });
                  }
                  setTimeout(
                    setTimeoutFun,
                    1000
                  )
                },
                // 改变当前使用地点失败
                function (err) {
                  wx.showModal({
                    title: `改变当前使用地点失败`,
                    content: `爸爸快检查网络是否正常`,
                    confirmText: `好的`,
                    showCancel: false
                  });
                }
              );
              break;
          };
        },
        // 修改地点名称失败
        function (err) {
          wx.showModal({
            title: `修改地点名称失败`,
            content: `爸爸快检查网络是否正常`,
            confirmText: `好的`,
            showCancel: false
          });
        }
      );
    }
  },

  // 表单重置
  formReset: function() {
    console.log('form发生了reset事件')
  },
})
