// pages/od_change_site/od_change_site.js
var app = getApp()
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sitedata: [],
    siteid: '',
    order_num: '',
  },
  // 选择地址
  selsectsite(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      siteid: id
    })
  },
  // 获取地址列表
  get_sitelist: function () {
    let that = this
    wx: wx.request({
      url: api.data.get_site_userlist,
      data: {
        openId: app.globalData.openid
      },
      success: function (res) {
        console.log(res.data.data[0])
        that.setData({
          sitedata: res.data.data,
          siteid: res.data.data[0].id
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  changesite: function() {
    let that  = this
    wx.showLoading({
      title: '提交中',
    })
    wx:wx.request({
      url: api.data.orchang_site,
      data: {
        ordernumber: that.data.order_num,
        addesId: that.data.siteid
      },
      success: function(res) {
        if(res.data.state == 200) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
          wx:wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function(res) {
              if(res.confirm){
                wx:wx.navigateBack()
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading()
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      order_num: options.id
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
    this.get_sitelist()
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

  }
})