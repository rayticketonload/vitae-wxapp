// ------------------
// app.js
// ------------------
// 引入
const constants = require('./constants/constants');

App({

  onLaunch: function() {

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 展示用户当前存储在本地的第三方 session_key
    const local_session_key = wx.getStorageSync(`local_session_key`);
    console.log(`用户当前存储在本地的第三方 session_key（local_session_key）: %c${local_session_key}`, `color: #ffb119; background-color: transparent;`);

    // ------------------
    // 进入首页就让用户登录
    // ------------------
    // 开始执行登录的时候出现菊花转,直到登陆成功后关闭菊花转
    wx.showLoading({
      title: `登录中...`,
      mask: true,
    });

    // 访问微信的 login 接口
    wx.login({
      // 访问微信的 login 接口成功后就开始执行登录逻辑
      success: res => {
        // 开始执行登录逻辑，请求微信服务器拿用户的 code (有效期五分钟)
        console.log(`使用 we.login 从微信拿到用户的code: %c${res.code}`, `color: #ffb119; background-color: transparent;`);
        // 如果接口返回的数据里的 code 存在，就开始访问第三方服务器的登录接口
        if (res.code) {
          // 请求第三放服务器的登录接口
          wx.request({
            method: 'POST',
            url: `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}getToken`,
            // 将拿到的 code 传到第三方服务器
            // 由第三方服务器将 code 发回给微信以换取拥有这个 code 的微信用户的 session_key 和 session_id
            // 再由第三方组装好一个新的第三方 session_key 传回给微信用户，作身份识别用途
            data: {
              code: res.code
            },
            // 成功访问第三方登录接口后会拿到重新组装过的 session_key
            success: res => {
              console.log(`第三方返回重组完成的 session_key: %c${res.data.session_key}`, `color: #ffb119; background-color: transparent;`);
              if (res.data.session_key) {
                // 同步存储拿到的第三方 session_key 到 localStorage，命名为 local_session_key
                try {
                  wx.setStorageSync(
                    `local_session_key`,
                    `${res.data.session_key}`
                  )
                  // 存储成功后将 local_session_key 在控制台打印出来
                  const local_session_key = wx.getStorageSync(`local_session_key`);
                  console.log(`执行 wx.setStorageSync 成功，local_session_key 变更为: %c${local_session_key}`, `color: #ffb119; background-color: transparent;`);
                  // wx.hideLoading();
                }
                catch (e) {
                  console.log(`同步存储 session_key 到本地 local_session_key 时出错`, e);
                }
              }
            },
            // 访问第三方登录接口不成功
            fail: res => {
              console.log(`访问第三方登录接口不成功，返回信息为 %c${res.errMsg}`, `color: #e06c75;`);
              console.log(`访问第三方登录接口不成功，接口状态码为 %c${res.statusCode}`, `color: #e06c75;`);
            },
            // 访问第三方登录接口完成
            complete: res => {
              console.log(`访问第三方登录接口完成`);
            }
          })
        }
        // 如果接口返回的数据里的 code 不存在，则在控制台打印出信息
        else {
          console.log(`用户登录凭证（code）不存在！返回信息为 %c${res.errMsg}`, `color: #e06c75;`)
        }
      },
      // 访问微信的 login 接口不成功
      fail: res => {
        console.log(`使用 we.login 不成功，返回信息为 %c${res.errMsg}`, `color: #e06c75;`);
        console.log(`使用 we.login 不成功，接口状态码为 %c${res.statusCode}`, `color: #e06c75;`);
      },
      // 访问微信的 login 接口完成
      complete: res => {
        console.log(`使用 we.login 完成`);
      }
    })
  },

  globalData: {
    userInfo: null,
  },
})
