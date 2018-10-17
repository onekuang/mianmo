//index.js
//获取应用实例
var app = getApp()
var api = require('../../utils/api.js');
Page({
  data: {
    bankList: []
  },
  addAddess: function () {
    wx.navigateTo({
      url: "/pages/bankadd/bankadd"
    })
  },

  // 删除银行卡
  editAddess: function (e) {
    let that = this
    let bank_id = e.target.dataset.id
    wx.showModal({
      title: '警告',
      content: '是否确认删除该银行卡?',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: api.data.bank_delete,
            data: {
              id: bank_id
            },
            success: function(res) {
              wx.showToast({
                title: '删除成功',
              })
              that.get_data();
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        } else {
          console.log('取消')
        }
      }
    });
  },

  onLoad: function () {
    this.get_data();
    
    
  },
  get_data: function() {
    var that = this;
    wx.showLoading({
      title: '加载中'
    }),
      wx.request({
        url: api.data.get_bank_list,
        data: {
          openId: app.globalData.openid
        },
        success: function (res) {
          that.setData({
            bankList: res.data.date
          })
        },
        fail: function (res) { },
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
