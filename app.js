//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检测用户登录态是否失效
    wx.checkSession({
      // 登录状态未失效
      success: res => {
        console.log(`用户登录状态并未失效，返回信息为 %c${res.errMsg}`,`color: #6ab796;`);
      },
      // 登录状态已经失效
      fail: res => {
        console.log(`用户登录状态已经失效，返回信息为 %c${res.errMsg}`,`color: #e06c75;`);
        // 重新登录
        console.log(`现在进行重新登录`);
        wx.login({
          success: res => {
            if (res.code) {
              wx.request({
                method: 'POST',
                url: 'http://192.168.7.110:3000/wxApi/login', // 润荣本地调试接口
                data: {
                  code: res.code
                },
                success: res => {
                  console.log(`重新登录成功，返回信息为 %c${res.errMsg}`,`color: #6ab796;`);
                  console.log(`登录接口返回数据为：`,res);
                },
                fail: res => {
                  console.log(`执行重新登录失败，返回信息为 %c${res.errMsg}`,`color: #e06c75;`);
                  console.log(`执行重新登录失败，接口状态码为 %c${res.statusCode}`,`color: #e06c75;`);
                },
                complete: res => {
                  console.log(`登录接口请求执行完成`);
                }             
              })
            } else {
              console.log(`用户登录凭证（code）不存在！返回信息为 %c${res.errMsg}`,`color: #e06c75;`)
            }
            // 进来先验证登录状态
            // if (res.errMsg == 'login:ok') {
            //   console.log('登录成功');
            //   console.log(`并从微信服务端拿到用户的code(有效期五分钟): %c${res.code}`, `color: #ff9600;`);

              // 获取用户授权，获取TA的公开信息
              // wx.getUserInfo({
              //   fail: console.log('但用户还没授权应用获取用户公开信息'),
              //   success: res => {
              //     console.log('好了，用户授权获取TA的公开信息了'),
              //       console.log('现在打印出用户的公开信息：', res.userInfo),

              //       // 将全局的userInfo赋值为刚拿回来的userInfo
              //       this.globalData.userInfo = res.userInfo
              //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              //     // 所以此处加入 callback 以防止这种情况
              //     if (this.userInfoReadyCallback) {
              //       this.userInfoReadyCallback(res)
              //     }
              //   }
              // })

            //   // wx.getSetting({
            //   //   success: res => {
            //   //     console.log('getSettingRes', res);
            //   //     // if (res.authSetting['scope.userInfo']) {
            //   //     //   // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            //   //     //   wx.getUserInfo({
            //   //     //     success: res => {
            //   //     //       // 可以将 res 发送给后台解码出 unionId
            //   //     //       this.globalData.userInfo = res.userInfo

            //   //     //       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            //   //     //       // 所以此处加入 callback 以防止这种情况
            //   //     //       if (this.userInfoReadyCallback) {
            //   //     //         this.userInfoReadyCallback(res)
            //   //     //       }
            //   //     //     }
            //   //     //   })
            //   //     // } else {
            //   //     //   console.log('用户拒绝授权');
            //   //     // }
            //   //   }
            //   // })
            // } else {
            //   console.log('登录失败');
            // }
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            // wx.getUserInfo({
            //   success: res => {
            //     // console.log('userInfo',res.userInfo);
            //     // app.globalData.usedrInfo = res.userInfo
            //     // this.setData({
            //     //   userInfo: res.userInfo,
            //     //   hasUserInfo: true
            //     // })
            //   }
            // })
          }
        })
      }
    })

    

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log('getSettingRes',res);
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     } else {
    //       console.log('用户拒绝授权');
    //     }
    //   }
    // })
  },

  globalData: {
    userInfo: null
  }
})