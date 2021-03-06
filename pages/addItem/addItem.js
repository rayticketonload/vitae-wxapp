// 获取应用实例
const app = getApp();
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');
// 引入 moment 时间戳编译
const moment = require("../../utils/moment");
// 引入 util 资源
const util = require('../../utils/util');

const timestamp = Date.parse(new Date());
const localDate = new Date(timestamp);

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 父级收纳盒
    parentPack: ``,
    parentPackID: null,
    // 物品
    path:[],
    itemName: null,
    itemQuantity: 1,
    date: ``,
    remindDate: ``,
    remindDateStart: ``,
    remindDateEnd: ``,
    expireDateHaveProblem: false,
    rd2ed: 0,
    // selectMenu 开关
    selectMenu: false,
    selectMenuList: [],
  },

  formSubmit: function(e) {
    let me = this;

    e.detail.value.itemName = util.trim(e.detail.value.itemName);
    e.detail.value.itemQuantity = util.trim(e.detail.value.itemQuantity);

    // 提交错误描述
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
        constants.API.addGood,
        {
          name: e.detail.value.itemName,
          parentId: me.data.parentPackID,
          expireDate: me.data.date,
          remindDate: me.data.remindDate,
          pic: me.data.path,
          quantity: e.detail.value.itemQuantity,
          currentLocationName: app.globalData.currentLocationName,
          currentLocationID: app.globalData.currentLocationID,
        },
        // 添加收纳点成功
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
                title: `添加成功`,
                duration: 1000
              });
              const setTimeoutFun = () => {
                wx.reLaunch({
                  url: constants.ROUTE.list(me.data.parentPackID, me.data.parentPack, "good"),
                });
              };
              setTimeout(
                setTimeoutFun,
                1000
              );
              break;
          }
        },
        // 添加物品失败
        function (err) {
          wx.showModal({
            title: `添加物品失败`,
            content: `爸爸快检查网络是否正常`,
            confirmText: `好的`,
            showCancel: false
          });
        }
      )
    }
  },

  // 物品名称正在输入
  itemNameKeyIn: function(e) {
    this.setData({
      itemName: e.detail.value,
    });
  },

  // 物品数量正在输入
  itemQuantityKeyIn: function(e = 1) {
    this.setData({
      itemQuantity: e.detail.value,
    });
  },

  // 物品名称重置
  itemNameReset: function() {
    this.setData({
      itemName: ``
    });
  },

  // 物品数量重置
  itemQuantityReset: function() {
    this.setData({
      itemQuantity: ``
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
      parentPack: e.currentTarget.dataset.name,
    })
  },

  // 保质日期倒推30天时间为提醒过期日期
  setRemindDate: function(dd,dadd = -30) {
    let result = new Date(dd);
    result = result.valueOf();
    result = result + dadd * 24 * 60 * 60 * 1000;
    result = new Date(result);
    return moment(Date.parse(result)).format('L')
  },

  // 判断填写的保质日期是不是已成历史
  isHistoryDate: function(needVaildDate) {
    let result;
    const today = new Date(localDate.getTime());
    const theNeedVaildDate = new Date(needVaildDate);
    if (theNeedVaildDate > today) {
      // 保质期不是已成历史或者今天的话就返回false
      result = false;
    } else {
      // 否则都为true
      result = true;
    }
    return result;
  },

  // 设置保质日期
  getDate: function(e) {
    const preExpireDate = e.detail.value;  // 用户选择的保质日期
    const autoSetRemindDate = this.setRemindDate(preExpireDate); // 根据用户选择的保质日期，默认倒推30天为保质期到期提醒日
    const today = moment(parseInt(localDate.getTime())).format('L'); // 今天
    const tomorrow = this.setRemindDate(today, 1); // 明天

    // 判断用户选择的保质日期是否已成历史或刚好是今天，是的话为true，不是的话为false
    this.setData({
      expireDateHaveProblem: this.isHistoryDate(preExpireDate),
    })

    if (this.data.expireDateHaveProblem) { // 填写的保质日期已经成历史或者就是今天过期，那就不用填写过期提醒日期
      this.setData({
        date: preExpireDate,
      });
    }
    else { // 填写的保质日期在将来，那就可以填写过期日期
      if (this.isHistoryDate(autoSetRemindDate)) { // 如果倒推30天时间之后的日期已经是历史时间，那就将提醒时间预设为明天
        this.setData({
          date: preExpireDate,
          remindDateStart: today,
          remindDateEnd: preExpireDate,
          remindDate: tomorrow,
          rd2ed: (new Date(preExpireDate) - new Date(tomorrow)) / (24 * 60 * 60 * 1000),
        });
      } else {
        this.setData({
          date: preExpireDate,
          remindDateStart: moment(parseInt(localDate.getTime())).format('L'),
          remindDateEnd: preExpireDate,
          remindDate: autoSetRemindDate,
          rd2ed: (new Date(preExpireDate) - new Date(autoSetRemindDate)) / (24 * 60 * 60 * 1000),
        });
      }
    }
  },

  // 设置到期提醒日期
  getRemindDate: function(e) {
    this.setData({
      remindDate: e.detail.value,
      rd2ed: (new Date(this.data.date) - new Date(e.detail.value)) / (24 * 60 * 60 * 1000),
    });
  },

  // 删除保质日期
  delDate: function(e) {
    this.setData({
      date: e.detail.value,
      remindDate: e.detail.value,
      rd2ed: 0,
    });
  },

  // 删除到期提醒日期
  delRemindDate: function(e) {
    this.setData({
      remindDate: e.detail.value,
      rd2ed: 0,
    });
  },

  uploaderChange: function(e) {
    this.setData({
      path: e.detail.data[0],
    });
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let me = this;
    // 初始化表单验证
    // 验证规则
    const vr = {
      itemName: {
        required: true,
      },
      itemQuantity: {
        required: true,
      }
    };
    // 验证返回信息
    const vm = {
      itemName: {
        required: `爸爸，要填名称的`
      },
      itemQuantity: {
        required: `爸爸，数量填个 0 也可以`
      }
    };
    me.validator = app.validator(vr, vm);
    me.setData({
      parentPackID: options.parentPackID,
      parentPack: options.parentPackName
    });
    // 获取当前位置下的所有收纳点信息，赋值到存放位置选择的菜单
    request.get(
      constants.API.getPackListByDefaultPack,
      // 获取当前位置下的所有收纳点信息成功
      function(res) {
        me.setData({
          selectMenuList: res.data
        })
      },
      // 获取当前位置下的所有收纳点信息失败
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
