// 引入常量
var constants = require('../constants/constants');

// 登录流程
function login() {
  // 访问微信的 login 接口
  wx.login({
    // 访问微信的 login 接口成功后就开始执行登录逻辑
    success: res => {
      // 开始执行登录的时候出现菊花转,直到登陆成功后关闭菊花转
      wx.showLoading({
        title: `登录中...`,
        mask: true,
      });
      // wx.showModal({
      //   title: `已有措施预防数据再次丢失`,
      //   content: `丢失数据已不可挽回，很抱歉`,
      //   confirmText: '确定',
      //   success: function (res) {
      //   }
      // });
      // 访问微信的 login 接口成功后会拿到户的微信账户 code (有效期五分钟)
      // 将拿到的 code 传到第三方服务器
      // 由第三方服务器将 code 发回给微信以换取拥有这个 code 的微信用户的 session_key 和 session_id
      // 再由第三方组装好一个新的第三方 session_key 传回给微信用户，作身份识别用途
      // console.log(`成功访问 wx.login 接口，拿到用户的微信账号 code: %c${res.code}`, `color: #ffb119;`);
      // 开始访问第三方服务器的登录接口
      wx.request({
        method: 'POST',
        url: constants.API.getToken,
        data: {
          code: res.code
        },
        // 成功访问第三方登录接口后会拿到重新组装过的 session_key
        success: res => {
          // console.log(`成功访问第三方登录接口，返回重组完成的 session_key: %c${res.data.session_key}`, `color: #ffb119;`);
          const app = getApp();
          // 将拿回来的 session_key 放入 globalData
          app.globalData.session_key = res.data.session_key;
          // 将 globalData 的用户登录状态改变为 1 （已登录）
          app.globalData.isLogin = 1;
          wx.hideLoading();
          // 由于网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (app.sessionkeyReadyCallback) {
            app.sessionkeyReadyCallback(res);
            app.sessionkeyReadyCallbackInStandardLayout(res);
          };
        },
        // 访问第三方登录接口不成功
        fail: res => {
          console.log(`访问第三方登录接口不成功`, res);
          wx.showModal({
            title: '登录失败',
            content: '爸爸，不如检查下你的网络？',
            showCancel: false,
            confirmText: '好的',
            // success: function(res) {
            //   if (res.confirm) {
            //     // wx.navigateBack({
            //     //   delta: 0
            //     // })
            //   }
            // }
          });
          wx.hideLoading();
        },
      })
    },
    // 访问微信的 login 接口不成功
    fail: res => {
      console.log(`使用 we.login 接口不成功`, res);
      wx.showModal({
        title: '微信服务器不理你',
        content: '爸爸，不如检查下你的网络？',
        showCancel: false,
        confirmText: '好的',
        // success: function(res) {
        //   if (res.confirm) {
        //     // wx.navigateBack({
        //     //   delta: 0
        //     // })
        //   }
        // }
      })
    },
  })
}

module.exports = {
  login: login
};
