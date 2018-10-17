//index.js
//获取应用实例
var app = getApp()
var api = require('../../utils/api.js');
Page({
  data: {
    wuliu_list:[],
    orderId:'',
    kuaidinum:'',
  },
  onLoad: function (e) {
    var orderId = e.id
    console.log(orderId)
    this.setData({
      orderId: orderId
    })
    // this.data.orderId = orderId;
  },
  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '请稍等',
    })
    wx.request({
      url: api.data.order_kuaidi,
      data: {
        expNum: that.data.orderId,
      },
      success: (res) => {
        console.log(res)
        if(res.data.state == 200){
          that.setData({
            wuliu_list: res.data.data.Traces.reverse(),
            kuaidinum: res.data.data.LogisticCode
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.k_share();
  }
})
