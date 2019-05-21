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
    noPack: base64.noDataPack,
    noGood: base64.noDataItem,
    // 搜索历史
    needHistory: true,
    historyList: [],
    // 搜用户当前的房屋
    currentLocationID: null,
    // 搜索框相关
    searchValue: null,
    searchIcon: base64.searchIconColorffaa7a,
    // 搜索结果
    packList: [],
    goodList: [],
    // 搜索结果 tab
    packTabName: '收纳点',
    goodTabName: '物品',
    packListChecked: false,
    goodListChecked: false,
    checked: null,
    // fileServer
    serverName: `${constants.NP}${constants.APIDOMAIN}${constants.IMGPATH}`
  },

  onReady: function() {
    // 获得 standardLayout 组件
    this.standardLayout = this.selectComponent("#standardLayout");
  },

  // 去掉左右空格
  trim: function(string) {
    return string.replace(/(^\s*)|(\s*$)/g, "");
  },

  // tab点击事件
  radioChange: function(e) {
    this.setData({
      checked: e.detail.value
    });
    switch (e.detail.value) {
      case this.data.packTabName:
        this.setData({
          packListChecked: true,
          goodListChecked: false,
        });
        break;
      case this.data.goodTabName:
        this.setData({
          packListChecked: false,
          goodListChecked: true,
        });
        break;
        default:
    }
  },

  // 搜索框输入的值为空时就显示历史搜索记录
  needHistoryFun: function() {
    if (this.data.searchValue == '' || !this.data.searchValue || this.data.searchValue == ' ') {
      this.setData({
        needHistory: true,
      });
    };
  },

  // 搜索 key 输入
  searchValueKeyIn: function(e) {
    this.setData({
      searchValue: e.detail.value,
    });
    this.needHistoryFun();
  },

  // 搜索 key 重置
  searchValueReset: function() {
    this.setData({
      searchValue: null
    });
    this.needHistoryFun();
  },

  // 获取搜索历史
  getHistory: function() {
    let me = this;
    wx.getStorage({
      key: constants.SEARCH_HISTORY_KEY,
      success(res) {
        me.setData({
          historyList: res.data,
        });
      },
      fail(e) {
        wx.setStorage({
          key: constants.SEARCH_HISTORY_KEY,
          data: [],
        })
      },
    })
  },

  // 添加搜索历史
  addHistory: function(searchHistory, key) {
    searchHistory.unshift(key);
    wx.setStorage({
      key: constants.SEARCH_HISTORY_KEY,
      data: searchHistory,
    });
    this.setData({
      historyList: searchHistory,
    });
  },

  // 清空搜索历史
  removeHistory: function() {
    wx.setStorage({
      key: constants.SEARCH_HISTORY_KEY,
      data: [],
    });
    this.setData({
      historyList: [],
    });
  },

  // 修改搜索历史
  modifyHistory: function(key) {
    try {
      const searchHistory = wx.getStorageSync(constants.SEARCH_HISTORY_KEY);

      // 看新的搜索字段和历史里面的有没有重复
      let ok;
      for (let i = 0; i < searchHistory.length; i++) {
        if (key == searchHistory[i]) {
          ok = false;
          return;
        } else {
          ok = true;
        }
      };

      if (searchHistory.length == 0) {
        this.addHistory(searchHistory, key);
      }
      else if (searchHistory.length == 10 && ok) {
        searchHistory.pop();
        this.addHistory(searchHistory, key);
      }
      else if (ok) {
        this.addHistory(searchHistory, key);
      }
    } catch (e) {}
  },

  // 从搜索历史里面搜索
  searchFromHistory: function(e) {
    let me = this;
    const KEY = e.currentTarget.dataset.key;
    me.setData({
      searchValue: KEY,
    });
    me.searchSubmit(KEY);
  },

  // 提交参数去搜索
  searchSubmit: function(key) {
    let me = this;
    request.post(
      constants.API.search,
      {
        key: key,
        id: me.data.currentLocationID,
      },
      // 搜索成功
      function (res) {
        switch (res.code) {
          case 100:
            wx.showToast({
              title: `${res.msg}`,
              icon: 'none',
              duration: 3000,
            });
            break;
          case 200:
            wx.showToast({
              title: `搜索完成`,
              duration: 1000
            });
            me.setData({
              needHistory: false,
            });
            const pl = res.data.packList.map((itemObj) => {
              return {
                create_timestamp: moment(parseInt(itemObj.create_timestamp)).format('L'),
                date: itemObj.date,
                id: itemObj.id,
                image_path: itemObj.image_path,
                name: itemObj.name,
                parent_id: itemObj.parent_id,
                parent_name: itemObj.parent_name,
                type: itemObj.type,
                update_timestamp: moment(parseInt(itemObj.update_timestamp)).format('L'),
              }
            });
            const gl = res.data.goodList.map((itemObj) => {
              return {
                create_timestamp: moment(parseInt(itemObj.create_timestamp)).format('L'),
                date: itemObj.date,
                expire_date: itemObj.expire_date ? itemObj.expire_date : '--',
                id: itemObj.id,
                name: itemObj.name,
                parent_id: itemObj.parent_id,
                parent_name: itemObj.parent_name,
                pic_address: itemObj.pic_address,
                type: itemObj.type,
                update_timestamp: moment(parseInt(itemObj.update_timestamp)).format('L'),
              }
            });
            me.setData({
              packList: pl,
              goodList: gl,
            });
            break;
        }
      },
      // 搜索失败
      function (err) {
        wx.showModal({
          title: `搜索失败`,
          content: `爸爸快检查网络是否正常`,
          confirmText: `好的`,
          showCancel: false
        });
      }
    )
  },

  // 从输入框输入搜索字段
  searchFromKeyIn: function(e) {
    let me = this;
    const KEY = me.trim(e.detail.value);

    if (!KEY) {
      wx.showToast({
        title: `你什么都没有填吧`,
        icon: `none`,
        duration: 3000,
      });
      return;
    }

    me.modifyHistory(KEY);
    // 提交搜索 key
    me.searchSubmit(KEY);
  },

  // 进入收纳点
  inToThisPack: function(e) {
    wx.reLaunch({
      url: constants.ROUTE.list(e.currentTarget.dataset.id, e.currentTarget.dataset.name),
    });
  },

  // 修改收纳点
  packEdit: function(e) {
    wx.navigateTo({
      url: constants.ROUTE.editBox(e.currentTarget.dataset.id),
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
            constants.API.deletePackById,
            { "id": e.currentTarget.dataset.id },
            // 请求成功
            function(res) {
              switch (res.code) {
                case 100:
                  wx.showToast({
                    title: `${res.msg}`,
                    icon: 'none',
                    duration: 3000,
                  });
                  break;
                case 200:
                  wx.showToast({
                    title: `删除成功`,
                    duration: 1000
                  });
                  me.data.packList.splice(e.currentTarget.dataset.idx, 1);
                  me.setData({
                    packList: me.data.packList,
                  });
                  break;
                  default:
              }
            },
            // 请求失败
            function(err) {
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
      url: constants.ROUTE.editItem(e.currentTarget.dataset.id),
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
            constants.API.deleteItemById,
            { "id": e.currentTarget.dataset.id },
            // 请求成功
            function(res) {
              switch (res.code) {
                case 100:
                  wx.showToast({
                    title: `${res.msg}`,
                    icon: 'none',
                    duration: 3000,
                  });
                  break;
                case 200:
                  wx.showToast({
                    title: `删除成功`,
                    duration: 1000
                  });
                  me.data.goodList.splice(e.currentTarget.dataset.idx, 1);
                  me.setData({
                    goodList: me.data.goodList,
                  });
                  break;
                  default:
              }
            },
            // 请求失败
            function(err) {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      checked: this.data.packTabName,
      packListChecked: true,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getHistory();
    this.setData({
      currentLocationID: app.globalData.currentLocationID,
    });
  },

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
