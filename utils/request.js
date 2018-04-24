var app = getApp();

// post
function post(url, data, successCallback, failCallback, completeCallback) {
  wx.showLoading({
    title: `网络通讯中...`,
    mask: true
  });
  if (typeof url === "object") {
    // 兼容 json 格式的参数
    // console.log(url);
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
    method: "POST",
    header: {
      Authorization: `Bearer ${app.globalData.session_key}`
    },
    success: res => {
      successCallback && successCallback.call(null, res.data);
    },
    fail: err => {
      failCallback && failCallback.call(err);
    },
    complete: data => {
      wx.hideLoading();
      completeCallback && completeCallback.call(data);
    }
  });
}

// get
function get(url, successCallback, failCallback, completeCallback) {
  if (typeof url === "object") {
    // 兼容 json 格式的参数
    // console.log(url);
    var opt = url;
    url = opt.url;
    successCallback = opt.success;
    failCallback = opt.fail;
    completeCallback = opt.complete;
  }
  wx.request({
    url: url,
    method: "GET",
    header: {
      Authorization: `Bearer ${app.globalData.session_key}`
    },
    success: res => {
      // console.log(`get success`, res.data);
      successCallback && successCallback.call(null, res.data);
    },
    fail: err => {
      // console.log("get fail");
      failCallback && failCallback.call(err);
    },
    complete: data => {
      wx.hideLoading();
      // console.log("get complete", data);
      completeCallback && completeCallback.call(data);
    }
  });
}

// post
function uploadFile(url, filePath, successCallback, failCallback, completeCallback) {
  wx.showLoading({
    title: `网络通讯中...`,
    mask: true
  });
  if (typeof url === "object") {
    var opt = url;
    url = opt.url;
    filePath = opt.filePath;
    successCallback = opt.success;
    failCallback = opt.fail;
    completeCallback = opt.complete;
  }
  wx.uploadFile({
    url: url,
    filePath: filePath,
    name: "photo",
    header: {
      Authorization: `Bearer ${app.globalData.session_key}`
    },
    success: res => {
      successCallback && successCallback.call(null, JSON.parse(res.data));
    },
    fail: err => {
      failCallback && failCallback.call(err);
    },
    complete: data => {
      wx.hideLoading();
      completeCallback && completeCallback.call(data);
    }
  });
}

module.exports = {
  post: post,
  get: get,
  uploadFile: uploadFile
};
