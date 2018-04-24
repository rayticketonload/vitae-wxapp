// 获取应用实例
const app = getApp();
// 引入常量
const constants = require('../../constants/constants');
// 引入封装好的请求方法
const request = require('../../utils/request');
// 引入表单验证规则
import customValidatorRule from '../../utils/validatorsRules';

Page({

  // 页面的初始数据
  data: {
    locationId: null,
    parentId: null,
    // 表单组件初始数据
    form: {
      locationName: {
        name: `locationName`,
        placeholder: `地点名称是？例如：家，公司，仓库...`,
        value: ``
      }
    }
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 从 URL 拿传过来的房屋地点ID和名称
    this.setData({
      locationId: options.locationId,
      form: {
        locationName: {
          value: options.locationName,
        }
      }
    });
    // 初始化表单验证
    // 验证规则
    const vr = {
      locationName: {
        //required: true,
        //locationNameNoBlank: true
      }
    };
    // 验证返回信息
    const vm = {
      locationName: {
        required: `爸爸，要填名称的`
      }
    };
    this.validator = app.validator (vr, vm);

    // 自定义表单校验规则
    // 地点名称不能有空格
    this.validator.addMethod('locationNameNoBlank', (value, param) => {
      console.log(`value`, value);
      return this.validator.optional(value) || customValidatorRule.noBlank.test(value);
    }, '地点名称不能有空格');
  },

  // 表单提交
  formSubmit: function(e) {
    let me = this;
    // 提交错误描述
    if (!me.validator.checkForm(e)) {
      const error = me.validator.errorList[0];
      wx.showToast({
        title: `${error.msg}`,
        icon: `none`,
        duration: 3000
      });
      return false;
    } else {
      const url = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}updatePackInfoById`;
      let data = {
        parentId: null,
        id: me.data.locationId,
        name: e.detail.value.locationName
      };
      console.log(`data`,data);
      request.post(
        url,
        data,
        // 修改地点名称成功
        function (res) {
          console.log("修改地点名称成功", res);
          // 然后将新地点改为当前使用地点
          const modifyDefaultPackAPI = `${constants.NP}${constants.APIDOMAIN}${constants.APIPATH}modifyDefaultPack`;
          const newLocationId = me.data.locationId;
          // 同时改变 globalData 里面 currentPackID
          app.globalData.currentPackID = newLocationId;
          // 请求改变当前使用地点
          request.post(
            modifyDefaultPackAPI,
            { id: newLocationId },
            // 改变当前使用地点成功
            function (success) {
              wx.showToast({
                title: `修改成功`,
                duration: 1000
              });
              console.log('成功改变当前使用地点');
              const setTimeoutFun = () => {
                wx.navigateBack({
                  delta: 2
                });
              }
              setTimeout(
                setTimeoutFun,
                1000
              )
            },
            // 改变当前使用地点失败
            function (err) {
              console.log('改变当前使用地点失败', err);
              wx.showModal({
                title: `改变当前使用地点失败`,
                content: `爸爸快检查网络是否正常`,
                confirmText: `好的`,
                showCancel: false
              });
            }
          );
        },
        // 修改地点名称失败
        function (err) {
          console.log("修改地点名称失败", err);
          wx.showModal({
            title: `修改地点名称失败`,
            content: `爸爸快检查网络是否正常`,
            confirmText: `好的`,
            showCancel: false
          });
        }
      );
    }
  },

  // 表单重置
  formReset: function() {
    console.log('form发生了reset事件')
  },
})
