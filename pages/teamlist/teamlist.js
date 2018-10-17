// pages/teamlist/teamlist.js
var app = getApp()
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    lists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      id: options.id
    })
  },
  send_data() {
    let that = this
    wx: wx.request({
      url: api.data.team_list,
      data: {
        openId: that.data.id,
      },
      success: function (res) {
        if (res.data.state == 200) {
          that.setData({
            lists: res.data.result
          })
        } else {
          wx.showToast({
            title: "网络有误",
          })
        }
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },
  gotodetail(e) {
    let that = this
    let id = e.currentTarget.dataset.id;
    that.setData({
      id: id
    })
    that.send_data();
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
    let that = this;
    that.send_data();
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