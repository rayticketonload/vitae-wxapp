var app = getApp();

// post
function post(url, data, successCallback, failCallback, completeCallback) {
  if(typeof(url) === "object") { // 兼容 json 格式的参数
    console.log(url);
    var opt = url;
    url = opt.url;
    data = opt.data;
    successCallback = opt.success;
    failCallback = opt.fail;
    completeCallback = opt.complete;
  }
  wx.request({
    url: url,
    data: data,
    method: 'POST',
    header: {
      'Authorization': `Bearer ${app.globalData.session_key}`
    },
    success: (res) => {
      console.log(res.data);
      successCallback && successCallback.call(null, res.data);
    },
    fail: (err) => {
      console.log('fail');
      failCallback && failCallback.call(err);
    },
    complete: (data) => {
      console.log(data);
      completeCallback && completeCallback.call(data);
    },
  })
}

module.exports = {
  post: post
}
