// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  formSubmit: function(e) {
    console.log('e.detail', e.detail)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    
    const param = {
      "url": `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}addPack`,
      "data": `${e.detail.value}`,
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
    request.post(param);
  },

  formReset: function() {
    console.log('form发生了reset事件')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})
