// ------------------
// index.js
// ------------------
// 获取应用实例
const app = getApp();

Page({

  data: {
    userInfo: {},
    hasUserInfo: false
  },

  onReady: function () {
    // 获得 standardLayout 组件
    this.standardLayout = this.selectComponent("#standardLayout");
  },

  onLoad: function () {
    // 使用 wx.getSetting 访问微信服务器确认小程序之前是否已经申请过获取用户公开信息的授权
    wx.getSetting({
      // 访问成功后，如果返回的数据里 scope.userInfo（公开信息）不存在则重新获取用户授权
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          console.log(`用户并未授权获取 TA 的公开信息，权限属性 scope.userInfo: %c${res.authSetting[`scope.userInfo`]}`,`color: #ffb119; background-color: transparent;`);
          // 获取用户授权拿TA的公开信息
          wx.getUserInfo({
            fail: res => {
              console.log('用户拒绝授权获取 TA 的公开信息');
            },
            success: res => {
              // 将全局的 userInfo 赋值为刚拿回来的 userInfo
              app.globalData.userInfo = res.userInfo;
              console.log('app.globalData.userInfo', app.globalData.userInfo);
              // 获取授权成功后再打印一下授权列表确认
              wx.getSetting({
                success: res => {
                  console.log(`好了，用户授权获取 TA 的公开信息，权限属性 scope.userInfo: %c${res.authSetting[`scope.userInfo`]}`,`color: #ffb119; background-color: transparent;`);
                }
              });
              wx.hideLoading();
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          })
        }
        else {
          console.log(`用户已经授权获取 TA 的公开信息，权限属性 scope.userInfo: %c${res.authSetting[`scope.userInfo`]}`,`color: #ffb119; background-color: transparent;`);
        }
      }
    })
  }
})
