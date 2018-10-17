// pages/notice/index.js
var app = getApp()
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: api.data.noticelist,
      data: {
        openId: app.globalData.openid
      },
      success: function (res) {
        if(res.data.state == 200){
          that.setData({
            notice:res.data.result
          })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }        
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })
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