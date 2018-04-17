// 获取应用实例
const app = getApp();
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');

Page({

  // 页面的初始数据
  data: {},

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.validator = app.validator (
      {
        locationName: {
          required: true,
        }
      },
      {
        locationName: {
          required: '请填写房屋名称'
        }
      }
    )
  },

  // 表单提交
  formSubmit: function(e) {
    // 提交错误描述
    if (!this.validator.checkForm(e)) {
      const error = this.validator.errorList[0];
      wx.showToast({
        title: `${error.msg}`,
        icon: `none`,
        duration: 3000
      });
      return false;
    } else {
      const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}addPack`;
      let data = {
        parentId: null,
        name: e.detail.value.locationName
      };
      request.post(
        url,
        data,
        this.formSubmitSuccess,
        this.formSubmitFail
      );
    }
  },

  // 表单提交成功
  formSubmitSuccess: function(data) {
    console.log("success data",data);
    wx.showToast({
      title: `添加成功`,
      icon: `none`,
      duration: 3000
    });
    wx.navigateBack({
      delta: 2
    });
  },

  // 表单提交失败
  formSubmitFail: function(data) {
    console.log("fail data",data);
    wx.showToast({
      title: `提交失败，请检查网络`,
      icon: `none`,
      duration: 3000
    });
  },

  // 表单重置
  formReset: function() {
    console.log('form发生了reset事件')
  },
})
