// 获取应用实例
const app = getApp();
// 引入常量
const constants = require("../../constants/constants");
// 引入封装好的请求方法
const request = require("../../utils/request");
// 引入 moment 时间戳编译
const moment = require("../../utils/moment");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [{ name: "全部", value: "all" }, { name: "收纳盒", value: "package" }, { name: "物品", value: "good" }],
    checked: "all",
    inputVal: "",
    list: [], //要显示的list
    packList: [],
    goodList: []
  },

  radioChange: function(e) {
    this.setData({
      checked: e.detail.value
    });
    this.showList();
  },
  // 获取用户房屋地点列表
  search: function(form = { key: "" }) {
    const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}search`;
    request.post(url, form, this.searchSuccess, this.searchFail);
  },

  //搜索返回成功
  searchSuccess: function(res) {
    this.setData({
      packList: res.data.packList,
      goodList: res.data.goodList
    });
    this.showList();
  },

  //搜索返回失败
  searchFail: function(res) {},
  //显示列表
  showList: function() {
    var list = [];
    switch (this.data.checked) {
      case "all":
        list = this.data.packList.concat(this.data.goodList).sort(
          (a, b) => moment(a.date) - moment(b.date) //按时间由早到晚排序
        );
        break;
      case "good":
        list = this.data.goodList;
        break;
      case "package":
        list = this.data.packList;
        break;
    }
    this.setData({
      list: list
    });
  },
  //提交
  formSubmit: function(e) {
    this.search(e.detail.value);
  },
  //清除
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  //输入事件
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.type);
    this.setData({
      checked: options.type || "all"
    });
    this.search();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
