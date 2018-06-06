// 获取应用实例
const app = getApp();
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');
// 引入 base64 资源
const base64 = require('../../base64/base64');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 父级收纳盒ID
    parentPackID: null,
    // 物品名称输入框初始数据
    itemName: `itemName`,
    itemNameLabel: `物品名称`,
    itemNamePlaceholder: `例如鸡蛋，唇膏，变形记刚...`,
    itemNameValue: ``,
    // 物品存放位置输入框初始数据
    parentPackName: `parentPackName`,
    parentPackLabel: `存放位置`,
    parentPackPlaceholder: `你想把 TA 放在？`,
    parentPackValue: ``,
    // selectMenu 开关
    selectMenu: false,
    selectMenuList: [],

    date: "",
    path:[],
  },

  // 物品名称正在输入
  itemNameValueKeyIn: function(e) {
    this.setData({
      itemNameValue: e.detail.value
    });
  },

  // 物品名称重置
  itemNameValueReset: function() {
    this.setData({
      itemNameValue: ``
    });
  },

  // 打开选择菜单
  selectMenuSwitch: function() {
    this.setData({
      selectMenu: !this.data.selectMenu
    })
  },

  // 菜单选择事件
  selectOption: function(e) {
    this.setData({
      selectMenu: false,
      parentPackID: e.currentTarget.dataset.id,
      parentPackValue: e.currentTarget.dataset.name,
    })
  },

  dateChange: function(e) {
    this.setData({
      date: e.detail.date
    });
  },

  uploaderChange: function(e) {
    this.setData({
      path: e.detail.date
    });
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let me = this;
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
    me.validator = app.validator (vr, vm);
    me.setData({
      parentPackID: options.parentPackID,
      parentPackValue: options.parentPackName
    });
    // 获取当前位置下的所有收纳点信息，赋值到存放位置选择的菜单
    request.get(
      `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getPackListByDefaultPack`,
      // 获取当前位置下的所有收纳点信息成功
      function(res) {
        console.log(`获取当前位置下的所有收纳点信息成功`, res);
        me.setData({
          selectMenuList: res.data
        })
      },
      // 获取当前位置下的所有收纳点信息失败
      function(err) {
        console.log(`获取当前位置下的所有收纳点信息失败`, err);
        wx.showModal({
          title: `获取收纳点列表失败`,
          content: `爸爸快检查网络是否正常`,
          confirmText: `好的`,
          showCancel: false
        });
      }
    );
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {
    // 获得 uploader 组件
    this.uploader = this.selectComponent("#uploader");
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
