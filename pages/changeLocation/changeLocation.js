




// 获取应用实例
const app = getApp();
// 引入常量
const constants = require("../../constants/constants");
// 引入 base64 资源
const base64 = require('../../base64/base64');
// 引入封装好的请求方法
const request = require("../../utils/request");
// 引入 moment 时间戳编译
const moment = require("../../utils/moment");

Page({

  // 页面的初始数据
  data: {
    list: [],
    packTotal: 0,
    locationItemTotalIcon: base64.locationItemTotal,
    locationPackTotalIcon: base64.locationPackTotal,
    urlQuery: `locationId`,
  },

  // 获取用户房屋地点列表
  getLocationList: function () {
    const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getDefaultPackList`;
    request.get(
      url,
      this.getListSuccess,
      this.getListFail
    );
  },

  // 获取用户房屋地点列表成功
  getListSuccess: function (res) {
    console.log(`获取房屋地点列表成功`, res);
    let packTotal = res.data.length;
    let list = res.data.map(function (item, idx) {
      return item;
    });
    this.setData({
      list: list,
      packTotal: packTotal,
    });
  },

  // 获取用户房屋地点列表失败
  getListFail: function (err) {
    console.log(`获取房屋地点列表失败`, err);
    wx.showToast({
      title: `获取房屋地点列表失败，请检查网络`,
      duration: 3000
    });
  },

  // 修改默认的盒子成功
  modifySuccess: function (res) {
    // 提交成功返回上一层路由（首页）
    wx.navigateBack({
      delta: 1
    })
  },

  // 修改默认的盒子失败
  modifyFail: function (err) {
    if (this.backupList) {
      this.setData({
        list: this.backupList
      });
    }
  },

  // 改变当前房屋地点
  locationSelect: function (e) {
    let data = { id: e.currentTarget.dataset.id };
    const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}modifyDefaultPack`;
    request.post(url, data, this.modifySuccess, this.modifyFail);
    this.backupList = this.data.list.concat(); //备份
    let list = this.data.list.map(function (item, idx) {
      item.checked = false;
      if (item.id === e.currentTarget.dataset.id) item.checked = true;
      return item;
    });
    //app.globalData
    this.setData({
      list: list
    });
  },

  // 跳转创建房屋地点
  locationAdd: function () {
    wx.navigateTo({
      url: `../addLocation/addLocation`
    });
  },

  // 跳转修改房屋地点
  locationEdit: function (e) {
    wx.navigateTo({
      url: `../editLocation/editLocation?${this.data.urlQuery}=${e.currentTarget.dataset.id}`
    });
  },

  // 删除房屋地点
  locationDel: function (e) {
    let me = this;
    // 确认现有的房屋地点是否只有1个，最后1个不能删
    if (me.data.packTotal > 1) {
      wx.showModal({
        title: '确认删除?',
        content: '属下物品和收纳点将一并删除',
        confirmText: '确认删除',
        confirmColor: '#f17c6b',
        success: function (res) {
          if (res.confirm) {
            let data = { id: e.currentTarget.dataset.id };
            const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}deletePackById`;
            request.post(
              url,
              data,
              me.locationDelSuccess,
              me.locationDelFail
            );
          }
        }
      });
    } else {
      wx.showToast({
        title: `最后一个地点不能删除`,
        icon: `none`,
        duration: 3000
      });
    }
  },

  // 删除房屋成功
  locationDelSuccess: function (data) {
    console.log(`删除房屋地点成功`, data);
    wx.showToast({
      title: `删除成功`,
      duration: 2000
    });
    this.getLocationList();
  },

  // 删除房屋失败
  locationDelFail: function (err) {
    console.log(`删除房屋地点失败`, err);
    wx.showToast({
      title: `删除失败，请检查网络连接`,
      duration: 2000
    });
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) { },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
    this.getLocationList();
  },

  // 生命周期函数--监听页面显示
  onShow: function () { },

  // 生命周期函数--监听页面隐藏
  onHide: function () { },

  // 生命周期函数--监听页面卸载
  onUnload: function () { },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () { },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () { },

  // 用户点击右上角分享
  onShareAppMessage: function () { }
});
