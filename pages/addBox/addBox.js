// 获取应用实例
const app = getApp();
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');
// 引入 base64 资源
const base64 = require('../../base64/base64');


Page({

  // 页面的初始数据
  data: {
    // 父级收纳盒ID
    parentPackID: null,
    // 收纳点名称输入框初始数据
    packName: `packName`,
    packLabel: `收纳点名称`,
    packPlaceholder: `例如冰箱，衣柜，阁楼...`,
    packValue: ``,
    // 收纳点存放位置输入框初始数据
    parentPackName: `parentPackName`,
    parentPackLabel: `存放位置`,
    parentPackPlaceholder: `你想把 TA 放在？`,
    parentPackValue: ``,
  },

  formSubmit: function(e) {

    const formData = {
      "name": e.detail.value.packName,
      "parentId": this.data.parentPackID
    };

    console.log('form发生了submit事件，携带数据为：', formData);

    const param = {
      "url": `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}addPack`,
      "data": formData,
      "success": function(data){
        console.log("data",data);
      },
      "fail": function (data) {
        console.log("fail", data);
      },
      "complete": function (data) {
        console.log("complete", data);
      }
    }

    if (!this.validator.checkForm(e)) {
      const error = this.validator.errorList[0];
      wx.showToast({
        title: `${error.msg}`,
        icon: `none`,
        duration: 3000
      });
      return false;
    } else {
      request.post(param);
    }
  },

  formReset: function() {
    console.log('form发生了reset事件')
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 初始化表单验证
    // 验证规则
    const vr = {
      packName: {
        required: true,
      }
    };
    // 验证返回信息
    const vm = {
      packName: {
        required: `爸爸，要填名称的`
      }
    };
    this.validator = app.validator (vr, vm);
    this.setData({
      parentPackID: options.parentPackID,
      parentPackValue: options.parentPackName
    });
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  // 生命周期函数--监听页面显示
  onShow: function () {

  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {

  },

  // 生命周期函数--监听页面卸载
  onUnload: function () {

  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {

  },

  // 用户点击右上角分享
  onShareAppMessage: function () {

  }
})
