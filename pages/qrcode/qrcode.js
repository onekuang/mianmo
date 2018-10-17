// pages/qrcode/qrcode.js 
var app = getApp()
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrimg:'',
    imgurl: api.imgurl,
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
      title: '生成二维码中..',
    })
    wx:wx.request({
      url: api.data.qrcode,
      data: {
        openId: app.globalData.openid,
      },
      success: function(res) {
        console.log(res.data.access_token)
        wx:wx.request({
          url: api.data.get_qrcode,
          data:{
            accessToken: res.data.access_token,
            openId: app.globalData.openid,
          },
          success: function(res) {
            if(res.data.state == 200) {
              that.setData({
                qrimg: res.data.path
              })
            }else{
              wx.showToast({
                title: res.data.msg,
              })
            }
          },
          fail: function(res) {},
          complete: function(res) {
            wx.hideLoading()
          },
        })
      },
      fail: function(res) {},
      complete: function(res) {},
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