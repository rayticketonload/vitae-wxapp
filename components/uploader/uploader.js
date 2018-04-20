// 引入常量
const constants = require("../../constants/constants");
// 引入封装好的请求方法
const request = require("../../utils/request");
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    files: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //增加图片

    chooseImage: function(e) {
      var that = this;
      var uploadTask;
      wx.chooseImage({
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          console.log(res);

          //上传去服务器
          uploadTask = wx.uploadFile({
            url: `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}upload`, //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[0],
            name: "photo",
            formData: {
              user: "test"
            },
            success: function(res) {
              var data = res.data;
              console.log(data);
            },
            fail: function(err) {
              //  var data = res.data;
              console.log(err);
            }
          });
          that.setData({
            files: that.data.files.concat(res.tempFilePaths)
          });
          uploadTask.onProgressUpdate(res => {
            console.log("上传进度", res.progress);
            console.log("已经上传的数据长度", res.totalBytesSent);
            console.log("预期需要上传的数据总长度", res.totalBytesExpectedToSend);
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
