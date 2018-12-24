// 获取应用实例
const app = getApp();
// 获取页面栈
const pages = getCurrentPages();
// 引入常量
const constants = require("../../constants/constants");
// 引入封装好的请求方法
const request = require("../../utils/request");
// 引入 base64 资源
const base64 = require('../../base64/base64');
// 引入 moment 时间戳编译
const moment = require("../../utils/moment");
moment.locale('zh-cn');

Page({
  data: {
    // 图标
    ruPackNameGoInIcon: base64.angleRight,
    ruPackDetailEditIcon: base64.editIconColor666,
    ruPackDetailDelIcon: base64.delIconColorful,
    noDataIcon: base64.searchIconColor666,
    // 当前 tab 选中哪个
    checked: "package",
    // tab content 的标签
    packListChecked: "package",
    goodListChecked: "good",
    // 当前所在的盒子ID
    currentPackId: ``,
    // 当前所在的盒子名称
    currentPackName: ``,
    // 上一次请求查询的盒子ID
    exPackId: null,
    // 要显示的list
    packList: [],
    packListTotal: 0,
    packListHaveData: true,
    goodList: [],
    goodListTotal: 0,
    goodListHaveData: true,
    // fileServer
    serverName: `${constants.NP}${constants.APIDOMAIN}`,
  },

  // tab 改变
  radioChange: function(e) {
    this.setData({
      checked: e.detail.value
    });
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.setData({
      currentPackName: options.packName,
      currentPackId: options.packId
    });
    if (options.checked) {
      this.setData({
        checked: options.checked,
      });
    }
    this.getList(
      this.data.currentPackId
    );
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {
    // 获得 standardLayout 组件
    this.standardLayout = this.selectComponent("#standardLayout");
  },

  // 获取收纳点内容列表
  getList: function(thePackId) {
    let me = this;
    request.post(
      `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getPAGListById`,
      { "id": thePackId },
      // getList 成功
      function(res) {
        console.log(`获取收纳点内容列表成功`, res);
        // 更改 globalData.parentPackID 和 name 为当前已经请求成功的收纳点ID和名称
        app.globalData.parentPackID = thePackId;
        app.globalData.parentPackName = res.data.currentPack.name;
        // 重组收纳点列表数据
        const pl = res.data.packList.map((itemObj) => {
          return {
            create_timestamp: moment(parseInt(itemObj.create_timestamp)).subtract(10, 'days').calendar(),
            date: itemObj.date,
            goodTotal: itemObj.goodTotal,
            id: itemObj.id,
            image_path: itemObj.image_path,
            name: itemObj.name,
            packTotal: itemObj.packTotal,
            parent_id: itemObj.parent_id,
            type: itemObj.type,
            update_timestamp: itemObj.update_timestamp,
          }
        });
        // 重组物品列表数据
        const gl = res.data.goodList.map((itemObj) => {
          return {
            create_timestamp: moment(parseInt(itemObj.create_timestamp)).subtract(10, 'days').calendar(),
            date: itemObj.date,
            expire_date: itemObj.expire_date ? itemObj.expire_date : '--',
            id: itemObj.id,
            name: itemObj.name,
            parent_id: itemObj.parent_id,
            pic_address: itemObj.pic_address,
            type: itemObj.type,
            update_timestamp: itemObj.update_timestamp,
          }
        })
        // 在设置自身的 data
        me.setData({
          currentPackId: thePackId,
          currentPackName: res.data.currentPack.name,
          exPackId: res.data.currentPack.parent_id,
          packList: pl.reverse(),
          goodList: gl.reverse(),
          packListTotal: res.data.packList.length,
          goodListTotal: res.data.goodList.length,
        });
        me.setData({
          packListHaveData: me.data.packList.length != 0 ? false : true ,
        });
        me.setData({
          goodListHaveData: me.data.goodList.length != 0 ? false : true ,
        });
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

  // 进去下层收纳点
  next: function(e) {
    this.getList(
      e.currentTarget.dataset.id
    );
  },

  // 去上一层收纳点
  prev: function() {
    this.getList(
      this.data.exPackId
    );
  },

  // 修改收纳点
  packEdit: function(e) {
    wx.navigateTo({
      url: `../editBox/editBox?packId=${e.currentTarget.dataset.id}&packName=${e.currentTarget.dataset.name}&parentPackId=${this.data.currentPackId}&parentPackName=${this.data.currentPackName}&packImg=${e.currentTarget.dataset.img}`
    });
  },

  // 删除收纳点
  packDel: function(e) {
    let me = this;
    // 弹窗确认删除
    wx.showModal({
      title: `删除此收纳点`,
      content: '属下物品和收纳点将一并删除',
      confirmText: '确认删除',
      confirmColor: '#f17c6b',
      success: function (res) {
        if (res.confirm) {
          // 请求删除
          request.post(
            `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}deletePackById`,
            { "id": e.currentTarget.dataset.id },
            // 请求删除收纳点成功
            function(res) {
              console.log(`删除收纳点成功`, res);
              wx.showToast({
                title: `删除成功`,
                duration: 2000
              });
              // 重新获取一次收纳点内容列表
              me.getList(
                me.data.currentPackId
              );
            },
            // 删除收纳点失败
            function(err) {
              console.log(`删除收纳点失败`, err);
              wx.showModal({
                title: `删除失败`,
                content: `爸爸快检查网络是否正常`,
                confirmText: `好的`,
                showCancel: false
              });
            }
          );
        }
      }
    });
  },

  // 修改物品
  itemEdit: function(e) {
    wx.navigateTo({
      url: `../editItem/editItem?itemId=${e.currentTarget.dataset.id}&itemName=${e.currentTarget.dataset.name}&parentPackId=${this.data.currentPackId}&parentPackName=${this.data.currentPackName}&itemImg=${e.currentTarget.dataset.img}&quantity=${e.currentTarget.dataset.quantity}`
    });
  },

  // 删除物品
  itemDel: function(e) {
    let me = this;
    // 弹窗确认删除
    wx.showModal({
      title: `删除此物品`,
      content: '物品删除后将不可恢复',
      confirmText: '确认删除',
      confirmColor: '#f17c6b',
      success: function (res) {
        if (res.confirm) {
          // 请求删除
          request.post(
            `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}deleteItemById`,
            { "id": e.currentTarget.dataset.id },
            // 请求删除收纳点成功
            function(res) {
              console.log(`删除物品成功`, res);
              wx.showToast({
                title: `删除成功`,
                duration: 2000
              });
              // 重新获取一次收纳点内容列表
              me.getList(
                me.data.currentPackId
              );
            },
            // 删除收纳点失败
            function(err) {
              console.log(`删除物品失败`, err);
              wx.showModal({
                title: `删除失败`,
                content: `爸爸快检查网络是否正常`,
                confirmText: `好的`,
                showCancel: false
              });
            }
          );
        }
      }
    });
  },
});
