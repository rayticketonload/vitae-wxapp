// 获取应用实例
const app = getApp();
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');
// 引入 base64 资源
const base64 = require('../../base64/base64');


Page({

  // 页面的初始数据
  data: {
    // 父级收纳点
    parentPackID: null,
    parentPackName: ``,
    // 收纳点
    packName: ``,
    packImage: '',
    // selectMenu 开关
    selectMenu: false,
    selectMenuList: []
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
    // 表单验证错误描述
    if (!me.validator.checkForm(e)) {
      const error = me.validator.errorList[0];
      wx.showToast({
        title: `${error.msg}`,
        icon: `none`,
        duration: 3000
      });
      return false;
    } else {
      request.post(
        `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}addPack`,
        {
          name: e.detail.value.packName,
          parentId: me.data.parentPackID,
          imagePath: me.data.packImage,
        },
        // 添加收纳点成功
        function (res) {
          switch (res.code) {
            case 100:
              wx.showToast({
                title: `${res.msg}`,
                icon: 'none',
                duration: 2000
              });
              break;
            case 200:
              wx.showToast({
                title: `添加成功`,
                duration: 1000
              });
              const setTimeoutFun = () => {
                wx.reLaunch({
                  url: `../list/list?packName=${me.data.parentPackName}&packId=${me.data.parentPackID}`
                });
              };
              setTimeout(
                setTimeoutFun,
                1000
              );
              break;
          }
        },
        // 添加收纳点失败
        function (err) {
          console.log('添加收纳点失败', err);
          wx.showModal({
            title: `添加收纳点失败`,
            content: `爸爸快检查网络是否正常`,
            confirmText: `好的`,
            showCancel: false
          });
        }
      )
    }
  },

  formReset: function() {
    console.log('form发生了reset事件')
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
    me.validator = app.validator(vr, vm);

    me.setData({
      parentPackID: options.parentPackID,
      parentPackName: options.parentPackName
    });

    // 获取所有收纳点信息，赋值到存放位置选择的菜单
    request.get(
      `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getPackListByDefaultPack`,
      // 获取所有收纳点信息成功
      function(res) {
        console.log(`获取所有收纳点信息成功`, res);
        me.setData({
          selectMenuList: res.data
        })
      },
      // 获取当前位置下的所有收纳点信息失败
      function(err) {
        console.log(`获取所有收纳点信息失败`, err);
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

  // 生命周期函数--监听页面显示
  onShow: function () {

  },

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
