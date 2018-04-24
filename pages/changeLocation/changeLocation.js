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
    thePack: 0, // 删除地点情景的开关
    locationItemTotalIcon: base64.heartIconColor666,
    locationPackTotalIcon: base64.boxIconColor666,
    urlQuery: {
      locationId: `locationId`,
      locationIdName: `locationName`,
    },
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

  // 改变当前房屋地点
  locationSelect: function (e) {
    let data = { id: e.currentTarget.dataset.id };
    const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}modifyDefaultPack`;
    request.post(url, data, this.modifySuccess, this.modifyFail);
    this.backupList = this.data.list.concat(); //备份
    // let list = this.data.list.map(function (item, idx) {
    //   item.checked = false;
    //   if (item.id === e.currentTarget.dataset.id) item.checked = true;
    //   return item;
    // });
    //app.globalData
    // this.setData({
    //   list: list
    // });
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

  // 跳转创建房屋地点
  locationAdd: function () {
    wx.navigateTo({
      url: `../addLocation/addLocation`
    });
  },

  // 跳转修改房屋地点
  locationEdit: function (e) {
    wx.navigateTo({
      url: `../editLocation/editLocation?${this.data.urlQuery.locationId}=${e.currentTarget.dataset.id}&&${this.data.urlQuery.locationIdName}=${e.currentTarget.dataset.name}`
    });
  },

  // 删除房屋地点
  locationDel: function (e) {
    let me = this;

    // 需要动到3个接口
    const getDefaultPackListAPI = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getDefaultPackList`;
    const deletePackByIdAPI = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}deletePackById`;
    const modifyDefaultPackAPI = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}modifyDefaultPack`;

    // 拿到触发事件的地点ID，赋值到请求的参数
    let packId = e.currentTarget.dataset.id;
    let data = { id: packId };

    // 设定一个删除地点情景的开关，需求说明:
    // 1，确认现有的房屋地点是否只有1个，最后1个不能删
    // 2,触发删除事件的房屋 ID 如果和 currentPackID 相同则需要帮用户在删除成功后将默认房屋换成列表顺序第一位的房屋
    const thePackFun = function() {
      // 房屋数量不止一个，且删除的地点ID和当前使用中的地点ID一样，删除之后还要帮用户设定新的默认地点
      if (me.data.packTotal > 1 && packId == app.globalData.currentPackID) {
        return 1;
      // 房屋数量不止一个, 且删除的地点ID不是当前使用中的地点ID，那就执行正常删除
      } else if (me.data.packTotal > 1 && packId != app.globalData.currentPackID) {
        return 2;
      // 否则就不能删除
      } else {
        return 0;
      }
    };
    me.setData({
      thePack: thePackFun(),
    })
    const thePack = me.data.thePack;

    // 通过 thePack 这个开关执行相对应的删除逻辑
    let notice = thePack == 1 ? `这个地点爸爸你正在用，确认删除?` : `删除此地点`;
    if (thePack == 0) {
      wx.showToast({
        title: `最后一个地点不能删除`,
        icon: `none`,
        duration: 3000
      });
    } else {
      wx.showModal({
        title: notice,
        content: '属下物品和收纳点将一并删除',
        confirmText: '确认删除',
        confirmColor: '#f17c6b',
        success: function (res) {
          if (res.confirm) {
            // 请求删除
            request.post(
              deletePackByIdAPI,
              data,
              // 请求删除房屋成功
              function(res) {
                console.log(`删除房屋地点成功`, res);
                wx.showToast({
                  title: `删除成功`,
                  duration: 2000
                });
                // 再获取一次房屋列表，刷新列表数目
                request.get(
                  getDefaultPackListAPI,
                  // 成功获取到删除成功后的房屋列表
                  function(res) {
                    console.log(`成功获取删除完成后的房屋地点列表`, res);
                    let packTotalNow = res.data.length;
                    let listNow = res.data.map(function (item, idx) {
                      return item;
                    });
                    me.setData({
                      list: listNow,
                      packTotal: packTotalNow,
                    });
                    // 假如删除的是正在使用的地点
                    if (thePack == 1) {
                      // 将新列表的第一个地点的ID改为当前正在使用的地点ID并提交去服务器，达到用户删除当前地点之后有一个新的当前地点能用，用户删除成功后回退到首页，不会拿到错误数据
                      // 同时改变 globalData 里面 currentPackID
                      let newCurrentPackID = res.data[0].id;
                      app.globalData.currentPackID = newCurrentPackID;
                      // 请求改变当前使用地点
                      request.post(
                        modifyDefaultPackAPI,
                        { id: newCurrentPackID },
                        // 改变当前使用地点成功
                        function (success) {
                          console.log('成功改变当前使用地点');
                        },
                        // 改变当前使用地点失败
                        function (err) {
                          console.log('改变当前使用地点失败', err);
                          if (me.backupList) {
                            me.setData({
                              list: me.backupList
                            });
                          }
                        }
                      );
                      me.backupList = me.data.list.concat(); //备份
                    }
                  },
                  // 获取删除完成后的房屋地点失败
                  function(err) {
                    console.log(`获取删除完成后的房屋地点失败`, err);
                    wx.showModal({
                      title: `再次获取地点列表失败`,
                      content: `爸爸快检查网络是否正常`,
                      confirmText: `好的`,
                      showCancel: false
                    });
                  },
                );
              },
              // 删除房屋失败
              function(err) {
                console.log(`删除房屋地点失败`, err);
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
    }
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
