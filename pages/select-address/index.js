//index.js
//获取应用实例
var app = getApp()
var api = require('../../utils/api.js');
Page({
  data: {
    addressList:[]
  },

  selectTap: function (e) {
    // var id = e.currentTarget.dataset.id;
    // wx.request({
    //   url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/shipping-address/update',
    //   data: {
    //     token:app.globalData.token,
    //     id:id,
    //     isDefault:'true'
    //   },
    //   success: (res) =>{
    //     wx.navigateBack({})
    //   } 
    // })
  },

  addAddess : function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  
  editAddess: function (e) {
    let that = this
    let id = e.target.dataset.id
    wx:wx.request({
      url: api.data.site_delete,
      data: {
        id:id
      },
      success: function(res) {
        that.initShippingAddress();
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  
  onLoad: function () {
    console.log('onLoad')

   
  },
  onShow : function () {
    this.initShippingAddress();
  },
  initShippingAddress: function () {
    var that = this;
    wx.request({
      url: api.data.get_site_userlist,
      data: {        
        openId: app.globalData.openid
      },
      success: (res) =>{
        
        that.setData({
          addressList: res.data.data
        })
        console.log(res.data)
      }
    })
  }

})
