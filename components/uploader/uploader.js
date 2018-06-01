/*jshint esversion: 6 */
// 引入常量
const constants = require("../../constants/constants");
// 引入封装好的请求方法
const request = require("../../utils/request");
// 引入 base64 资源
const base64 = require('../../base64/base64');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    limit: {
      type: Number,
      value: 8
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    files: [],
    path: [],
    // 图标
    camIcon: base64.camIconColorfff
  },

  /**
   * 组件的方法列表
   */
  methods: {
    uploadSuccess: function(res) {
      console.log(this.data.path);
      var path = this.data.path;
      path.push(res.path);
      this.triggerEvent("callback", { date: path });
    },
    uploadFail: function(err) {
      console.log("err");
    },
    //增加图片
    chooseImage: function(e) {
      var that = this;
      wx.chooseImage({
        sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          var path = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}upload/photo`;
          //上传去服务器
          request.uploadFile(path, res.tempFilePaths[0], that.uploadSuccess.bind(that), that.uploadFail.bind(that));
          that.setData({
            files: that.data.files.concat(res.tempFilePaths)
          });
        }
      });
    },
    //预览图片
    previewImage: function(e) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
      });
    }
  }
});
