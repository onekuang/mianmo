// pages/shiwu/shiwu.js
var app = getApp()
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx:wx.request({
      url: api.data.shiwujiangli,
      data: {
        openId: app.globalData.openid,
      },
      success: function(res) {
        if(res.data.state == 200) {
          that.setData({
            num: res.data.result.TOTALNUM
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.k_share();
  }
})