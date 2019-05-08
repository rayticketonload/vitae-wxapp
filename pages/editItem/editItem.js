// 获取应用实例
const app = getApp();
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 父级收纳盒
    parentPackID: null,
    parentPackName: ``,
    // 物品
    itemId: null,
    itemImg: '',
    itemName: ``,
    itemQuantity: 1,
    itemExpireDate: ``,
    // selectMenu 开关
    selectMenu: false,
    selectMenuList: [],

    // fileServer（serverName的值在 onload 的时候再附上去，不然在图片路径 load 出来之前，会报 404）
    serverName: ``
  },

  getDate: function(e) {
    this.setData({
      itemExpireDate: e.detail.value
    });
  },

  delDate: function(e) {
    this.setData({
      itemExpireDate: e.detail.value
    });
  },

  formSubmit: function(e) {
    let me = this;
    // 验证表单错误
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
        `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}updataGoodInfoById`,
        {
          id: me.data.itemId,
          name: e.detail.value.itemName,
          parentId: me.data.parentPackID,
          expireDate: me.data.itemExpireDate,
          pic: me.data.itemImg,
          quantity: e.detail.value.itemQuantity,
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
                title: `修改成功`,
                duration: 1000
              });
              const setTimeoutFun = () => {
                wx.reLaunch({
                  url: `../list/list?packName=${me.data.parentPackName}&packId=${me.data.parentPackID}&checked=good`
                });
              };
              setTimeout(
                setTimeoutFun,
                1000
              );
              break;
          }
        },
        // 修改物品失败
        function (err) {
          wx.showModal({
            title: `修改物品失败`,
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
  itemQuantityKeyIn: function(e) {
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

  // 保质日期重置
  exDateReset: function() {
    this.setData({
      itemExpireDate: ``
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
      parentPackName: e.currentTarget.dataset.name,
    })
  },

  uploaderChange: function(e) {
    this.setData({
      itemImg: e.detail.data[0],
    });
  },

  // 获取所有收纳点信息，赋值到存放位置选择的菜单
  getPackListByDefaultPack: function() {
    let me = this;
    request.get(
      `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getPackListByDefaultPack`,
      // 获取所有收纳点信息成功
      function(res) {
        me.setData({
          selectMenuList: res.data
        })
        me.getGoodInfoById();
      },
      // 获取所有收纳点信息失败
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

  // 获取当前物品信息
  getGoodInfoById: function() {
    let me = this;
    request.post(
      `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getGoodInfoById`,
      {
        id: this.data.itemId,
      },
      // 获取物品信息成功
      function (res) {
        me.setData({
          itemImg: res.data.pic_address,
          itemName: res.data.name,
          itemQuantity: res.data.quantity || 1,
          itemExpireDate: res.data.expire_date || '',
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
          title: `获取物品信息失败`,
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
    me.validator = app.validator (vr, vm);

    // 从 url 拿到列表带过来的物品 id
    me.setData({
      itemId: options.itemId,
      serverName: `${constants.NP}${constants.APIDOMAIN}${constants.IMGPATH}`,
    });

    me.getPackListByDefaultPack();
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
