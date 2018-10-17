// pages/text-detaile/index.js
var app = getApp()
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detaile:{},
  },

  //数据转化
  formatNumber : function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  formatTime :function (number, format) {
    var _this = this
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(_this.formatNumber(date.getMonth() + 1));
    returnArr.push(_this.formatNumber(date.getDate()));

    returnArr.push(_this.formatNumber(date.getHours()));
    returnArr.push(_this.formatNumber(date.getMinutes()));
    returnArr.push(_this.formatNumber(date.getSeconds()));

    for(var i in returnArr)
      {
        format = format.replace(formateArr[i], returnArr[i]);
      }
      return format;
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sjc = 1488481383;
    // console.log(this.formatTime(sjc, 'Y/M/D h:m:s'));
    
    this.setData({
      id:options.id
    })

    this.get_data(this.data.id)
  },
  get_data: function(id) {
    let that = this
    wx:wx.request({
      url: api.data.notice_detaile,
      data: {
        ID:that.data.id
      },
      success: function(res) {
        that.setData({
          detaile: res.data.result
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.k_share();
  }
})