// pages/accredit/index.js
var app = getApp();
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onLoad: function () {
  },
  bindGetUserInfo: function (e) {
    var that = this;
    // if (e.detail.userInfo) {
    //   wx.login({
    //     success: res => {
    //       wx.request({
    //         //后台接口地址
    //         url: api.data.send_userinfo,
    //         data: {
    //           userinfo: e.detail.userInfo,
    //           code: app.globalData.code,
    //           opId: app.globalData.parent_id
    //         },
    //         success: function (res) {
    //           if (res.data.state == 200) {
    //             app.globalData.openid = res.data.result.openId
    //             wx.setStorageSync('openid', app.globalData.openid)

    //             wx.switchTab({
    //               url: '/pages/index/index'
    //             })
    //           }else{
    //             wx.showToast({
    //             title: '授权失败',
    //             icon:'none'
    //         })
    //           }
    //         },
    //         fail: function (res) {
    //           wx: wx.showModal({
    //             title: '提示',
    //             content: '网络错误,请稍后再试',
    //             showCancel: 'false',
    //             success: function (res) { },
    //           })
    //         },
    //         complete: function (res) {
    //           wx.hideLoading()
    //         }
    //       })
    //     }
    //   })  
    // }

    // return
    
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '请稍等',
      })
      
      wx.request({
        url: api.data.send_userinfo,
        data: {
          userinfo: e.detail.userInfo,
          code: app.globalData.code,
          opId: app.globalData.parent_id
        },
        success: function (res) {      
          if(res.data.state == 200) {
            app.globalData.openid = res.data.result.openId
            wx.setStorageSync('openid', app.globalData.openid)
          
            wx.switchTab({
              url: '/pages/index/index'
            })
            // wx: wx.showModal({
            //   title: '提示',
            //   content: '授权成功',
            //   showCancel: false,
            //   complete: function (res) {
            //     wx.switchTab({
            //       url: '/pages/index/index'
            //     })
            //   },
            // })
          }else{
            console.log(res.data)
            wx.showToast({
              title: '授权失败',
              icon:'none'
            })

          }         
        },
        fail: function (res) {
          wx: wx.showModal({
            title: '提示',
            content: '网络错误,请稍后再试',
            showCancel:'false',
            success: function (res) { },
          })
        },
        complete: function(res) {
          wx.hideLoading()
        }
      })
    }else{
      wx:wx.showModal({
        title: '提示',
        content: '您的当前网络较慢,请稍后再试',
        showCancel: false,
      })
    }
  },
})