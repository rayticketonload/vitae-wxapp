// 获取应用实例
const app = getApp();
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');

Page({

  // 页面的初始数据
  data: {
    // 父级收纳点信息
    parentPackID: null,
    parentPackName: ``,
    // 当前收纳点信息
    packId: null,
    packName: ``,
    packImage: null,
    // selectMenu 开关
    selectMenu: false,
    selectMenuList: [],
    // fileServer（serverName的值在 onload 的时候再附上去，不然在图片路径 load 出来之前，会报 404）
    serverName: ``,
  },

  // 通过上传组件回调拿到上传的那张照片，确认保存的时候提交给服务器
  uploaderChange: function (e) {
    this.setData({
      packImage: e.detail.data[0],
    })
  },

  // 收纳点名称正在输入
  packNameKeyIn: function(e) {
    this.setData({
      packName: e.detail.value
    });
  },

  // 收纳点名称重置
  packNameReset: function() {
    this.setData({
      packName: ``
    });
  },

  formSubmit: function(e) {
    let me = this;
    // 表单验证错误
    if (!me.validator.checkForm(e)) {
      const error = me.validator.errorList[0];
      wx.showToast({
        title: `${error.msg}`,
        icon: `none`,
        duration: 3000,
      });
      return false;
    } else {
      request.post(
        constants.API.updataPackInfoById,
        {
          id: this.data.packId,
          name: e.detail.value.packName,
          imagePath: me.data.packImage,
          parentId: me.data.parentPackID,
        },
        // 访问修改收纳点成功
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
                title: `修改成功`,
                duration: 1000
              });
              const setTimeoutFun = () => {
                wx.reLaunch({
                  url: constants.ROUTE.list(me.data.parentPackID, me.data.parentPackName),
                });
              }
              setTimeout(
                setTimeoutFun,
                1000
              );
              break;
          };
        },
        // 访问修改收纳点失败
        function (err) {
          wx.showModal({
            title: `修改收纳点失败`,
            content: `爸爸快检查网络是否正常`,
            confirmText: `好的`,
            showCancel: false
          });
        }
      )
    }
  },

  // 获取所有收纳点信息，赋值到存放位置选择的菜单
  getPackListByDefaultPack: function() {
    let me = this;
    request.get(
      constants.API.getPackListByDefaultPack,
      // 获取所有收纳点信息成功
      function(res) {
        me.setData({
          selectMenuList: res.data
        });
        me.getPackInfoById();
      },
      // 获取当所有收纳点信息失败
      function(err) {
        wx.showModal({
          title: `获取收纳点列表失败`,
          content: `爸爸快检查网络是否正常`,
          confirmText: `好的`,
          showCancel: false
        });
      }
    );
  },

  // 获取当前收纳点信息
  getPackInfoById: function() {
    let me = this;
    request.post(
      constants.API.getPackInfoById,
      {
        id: this.data.packId,
      },
      // 获取收纳点信息成功
      function (res) {
        me.setData({
          packName: res.data.name,
          packImage: res.data.image_path,
          parentPackID: res.data.parent_id,
        });
        me.data.selectMenuList.map(item => {
          if (item.id == me.data.parentPackID) {
            me.setData({
              parentPackName: item.name,
            });
          }
        });
      },
      // 获取收纳点信息失败
      function (err) {
        wx.showModal({
          title: `获取收纳点信息失败`,
          content: `爸爸快检查网络是否正常`,
          confirmText: `好的`,
          showCancel: false
        });
      }
    )
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

    // 从 url 拿到列表带过来的收纳点 id
    me.setData({
      packId: options.packId,
      serverName: `${constants.NP}${constants.APIDOMAIN}${constants.IMGPATH}`
    });

    me.getPackListByDefaultPack();
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
      parentPackName: e.currentTarget.dataset.name,
    })
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
  },

  // 生命周期函数--监听页面显示
  onShow: function () {},

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
