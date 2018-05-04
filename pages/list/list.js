// 获取应用实例
const app = getApp();
// 引入常量
const constants = require("../../constants/constants");
// 引入封装好的请求方法
const request = require("../../utils/request");
// 引入 moment 时间戳编译
const moment = require("../../utils/moment");
// 引入 base64 资源
const base64 = require('../../base64/base64');


Page({

  data: {
    // 图标
    ruPackNameGoInIcon: base64.angleRight,
    ruPackDetailEditIcon: base64.editIconColor666,
    ruPackDetailDelIcon: base64.delIconColorful,
    noDataIcon: base64.searchIconColor666,
    // 内容列表的数据集
    resultUnit: {
      // 盒子列表的数据集
      pack: {
        ruPackImage: base64.boxIconColor666,
      }
    },
    // 当前所在的盒子ID
    currentLocationId: ``,
    // 当前所在的盒子名称
    currentLocationName: ``,
    // tab 按钮数据
    tab: [
      {
        name: "收纳点",
        value: "package"
      },
      {
        name: "物品",
        value: "good"
      }
    ],
    // 当前 tab 状态
    checked: "package",
    // tab content 的标签
    packListChecked: "package",
    goodListChecked: "good",
    // 要显示的list
    list: [],
    packList: [],
    packListHaveData: true,
    goodList: [],
    goodListHaveData: true,
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.setData({
      currentLocationName: options.packName,
      currentLocationId: options.packId
    });
    this.getList();
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {
    // 获得 standardLayout 组件
    this.standardLayout = this.selectComponent("#standardLayout");
  },

  radioChange: function(e) {
    this.setData({
      checked: e.detail.value,
      resultList: e.detail.value,
    });
    this.showList();
  },

  // 获取用户房屋地点列表
  getList: function() {
    let me = this;
    const data = {
      "id": me.data.currentLocationId
    }
    const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getPAGListById`;
    request.post(
      url,
      data,
      // getList 成功
      function(res) {
        me.setData({
          packList: res.data.packList,
          goodList: res.data.goodList
        });
        if (me.data.packList.length != 0) {
          me.setData({
            packListHaveData: false,
          });
        }
        if (me.data.goodList.length != 0) {
          me.setData({
            goodListHaveData: false,
          });
        }
        me.showList();
      },
      // getList 失败
      function(err) {
        console.log(`获取收纳点内容失败`, err);
        wx.showModal({
          title: `获取收纳点内容失败`,
          content: `爸爸快检查网络是否正常`,
          confirmText: `好的`,
          showCancel: false
        });
      }
    );
  },

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
});
