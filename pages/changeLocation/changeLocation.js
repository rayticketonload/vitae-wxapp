// 获取应用实例
const app = getApp();
// 引入常量
const constants = require("../../constants/constants");
// 引入封装好的请求方法
const request = require("../../utils/request");
const moment = require("../../utils/moment");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  /**
   * 获取用户可选默认盒子列表成功
   */
  getListSuccess: function(res) {
    let list = res.data.map(function(item, idx) {
      item.checked = false; //增加选中
      return item;
    });
    //app.globalData
    this.setData({
      list: list
    });
  },
  /**
   * 获取用户可选默认盒子列表失败
   */
  getListFail: function(err) {},
  /**
   * 修改默认的盒子点击事件
   */
  switchChange: function(e) {
    let data = { id: e.currentTarget.dataset.id };
    const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}modifyDefaultPack`;
    request.post(url, data, this.modifySuccess, this.modifyFail);

    this.backupList = this.data.list.concat(); //备份
    let list = this.data.list.map(function(item, idx) {
      item.checked = false;
      if (item.id === e.currentTarget.dataset.id) item.checked = true;
      return item;
    });
    //app.globalData
    this.setData({
      list: list
    });
  },

  /**
   * 修改默认的盒子成功
   */
  modifySuccess: function(res) {},

  /**
   * 修改默认的盒子失败
   */
  modifyFail: function(err) {
    if (this.backupList) {
      this.setData({
        list: this.backupList
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获取用户可选默认盒子列表
    const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getDefaultPackList`;
    request.get(url, this.getListSuccess, this.getListFail);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
