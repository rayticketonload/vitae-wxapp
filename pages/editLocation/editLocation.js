// 获取应用实例
const app = getApp();
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');

Page({

  // 页面的初始数据
  data: {
    locationId: null,
    parentId: null,
    form: {
      // 填写地点名称的输入框的初始值
      locationName: ``
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从 URL 拿传过来的房屋地点ID
    this.setData({
      locationId: options.locationId
    });
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.isEditLocation();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 判断是修改地点还是新增地点
  isEditLocation: function() {
    if (this.data.locationId != 'new') {


      this.setData({
        form: {
          locationName: ``
        }
      })
    } else {
      console.log('its new');
    }
  },

  // 表单提交
  formSubmit: function(e) {
    console.log('e.detail', e.detail)
    // 提交错误描述
    if (!this.validator.checkForm(e)) {
      const error = this.validator.errorList[0]
      // `${error.param} : ${error.msg} `
      wx.showToast({
        title: `${error.msg} `,
        duration: 3000
      })
      return false
    } else {
      const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}addPack`;
      let data = {
        parentId: this.data.parentId,
        name: e.detail.value.locationName
      };
      request.post(
        url,
        data,
        this.formSubmitSuccess,
        this.formSubmitFail
      );
      console.log('form发生了submit事件，携带数据为：', data)
    }
  },

  // 表单提交成功
  formSubmitSuccess: function(data) {
    console.log("success data",data);
    wx.navigateBack({
      delta: 2
    });
  },

  // 表单提交失败
  formSubmitFail: function(data) {
    console.log("fail data",data);
  },

  // 表单重置
  formReset: function() {
    console.log('form发生了reset事件')
  },
})
