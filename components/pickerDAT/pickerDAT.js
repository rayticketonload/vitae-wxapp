var dateTime = require("./dateTime.js");
Component({
  externalClasses: ["picker-class"],
 
  /**
   * 组件的属性列表
   */
  properties: {

    
  },

  /**
   * 组件的初始数据
   */
  data: {
    date: "2018-01-01",
    time: "12:00",
    dateTimeArray: null,
    dateTime: null,
    startYear: 2000,
    endYear: 2050
  },

  ready: function() {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTime.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeDateTime(e) {
      this.setData({ dateTime: e.detail.value });
    },
    changeDateTimeColumn(e) {
      var arr = this.data.dateTime,
        dateArr = this.data.dateTimeArray;
      arr[e.detail.column] = e.detail.value;
      dateArr[2] = dateTime.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
      this.setData({
        dateTimeArray: dateArr,
        dateTime: arr
      });
    }
  }
});
