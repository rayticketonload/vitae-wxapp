// 引入 base64 资源
const base64 = require('../../base64/base64');

Component({

  // 允许组件使用多 slot 模式
  // slot 是一个承载组件使用者提供的 wxml 标签的组件标签
  options: {
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // // 弹窗标题
    // title: {            // 属性名
    //   type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    //   value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    // },
    // // 弹窗内容
    // content :{
    //   type : String ,
    //   value : '弹窗内容'
    // },
    // // 弹窗取消按钮文字
    // cancelText :{
    //   type : String ,
    //   value : '取消'
    // },
    // // 弹窗确认按钮文字
    // confirmText :{
    //   type : String ,
    //   value : '确定'
    // }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 菜单开关
    menuSwitchBoolen: false,
    menuSwitchClass: [
      `menuSwitch`
    ],
    bottomNavWrapClass: [
      `bottomNavWrap`
    ],
    addItemIcon: base64.addItemIcon,
    addBoxIcon: base64.addBoxIcon,
    homeIcon: base64.homeIcon,
    userInfoIcon: base64.userInfoIcon,
    searchIcon: base64.searchIcon,
    shareIcon: base64.shareIcon,
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {

    // 打开菜单
    _menuSwitch(e){
      const { menuSwitchBoolen } = this.data;
      this.setData({
        menuSwitchBoolen: !this.data.menuSwitchBoolen
      });
      if ( !menuSwitchBoolen ) {
        this.setData({
          menuSwitchClass: [
            `menuSwitch`,
            `cancel`
          ],
          bottomNavWrapClass: [
            `bottomNavWrap`,
            `menuShow`
          ],
        })
      } else {
        this.setData({
          menuSwitchClass: [
            `menuSwitch`
          ],
          bottomNavWrapClass: [
            `bottomNavWrap`
          ],
        })
      }
    },

    // 回到首页
    _openIndex(e) {
      wx.redirectTo({
        url: `../index/index`
      });
    },

    // 跳转到添加物品表单页面
    _navToAddItem(e) {
      wx.navigateTo({
        url: `../addItem/addItem`
      });
      this.setData({
        menuSwitchBoolen: false,
        menuSwitchClass: [
          `menuSwitch`
        ],
        bottomNavWrapClass: [
          `bottomNavWrap`
        ],
      })
    },

    // 跳转到添加收纳盒表单页面
    _navToAddBox(e) {
      wx.navigateTo({
        url: `../addBox/addBox`
      });
      this.setData({
        menuSwitchBoolen: false,
        menuSwitchClass: [
          `menuSwitch`
        ],
        bottomNavWrapClass: [
          `bottomNavWrap`
        ],
      })
    }

    // 隐藏弹框
    // hideDialog(){
    //   this.setData({
    //     isShow: !this.data.isShow
    //   })
    // },

    // 展示弹框
    // showDialog(){
    //   this.setData({
    //     isShow: !this.data.isShow
    //   })
    // },

    /**
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    // _cancelEvent(){
    //   //触发取消回调
    //   this.triggerEvent("cancelEvent")
    // },
    // _confirmEvent(){
    //   //触发成功回调
    //   this.triggerEvent("confirmEvent");
    // }
  }
})
