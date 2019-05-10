var timestamp = Date.parse(new Date());
var date = new Date(timestamp);

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    start: {
      type: String,
      value: date.getFullYear() - 20,
    },
    end: {
      type: String,
      value: date.getFullYear() + 50,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: null,
    // startYear: date.getFullYear() - 50,
    // endYear: date.getFullYear() + 50,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeDate(e) {
      this.setData({
        value: e.detail.value
      });
      this.throwValue();
    },

    throwValue(){
      this.triggerEvent(
        'throwValue',
        {
          value: this.data.value,
        }
      );
    },

    rejectDate() {
      this.setData({
        value: null
      });
      this.delValue();
    },

    delValue(){
      this.triggerEvent(
        'delValue',
        {
          value: ``,
        }
      );
    },
  }
});
