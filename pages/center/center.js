const app = getApp();
var api = require('../../utils/api.js');

Page({
  data: {
    avatar: '',
    nickname: '',
    user_data:'', // 用户数据
    user_status: '', // 用户身份
    // 订单tab
    order_tab: [
      { id: '0', name: '待付款', icon: 'pay', url: '##' },
      { id: '1', name: '待发货', icon: 'send', url: '##' },
      { id: '2', name: '待收货', icon: 'deliver', url: '##' },
      { id: '3', name: '已完成', icon: 'wodefankui', url: '##' },
      // { id: '4', name: '售后', icon: 'wodefankui', url: '##' },
    ],
    // 签到模块
    qiandao_show: false,
    qiandao_btn: false,
    qiandao_day: 0
  },

  // 跳转到关于我们
  goto(e) {
    let url = e.currentTarget.dataset.url;

    wx.navigateTo({
      url: url
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    let self = this;
    wx.getUserInfo({
      success: function (res) {
        self.setData({
          avatar: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    })    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  alert_notive(id,info) {
    let nid = id
    let msg = wx.getStorageSync('notive') || []
    if (msg == nid ) {
      return
    }else{
      wx.setStorageSync('notive', nid)
      wx.showModal({
        title: '公告',
        content: info,
        showCancel: false,
      })
    }    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.has_openid();
    this.get_userinfodata()
  },
  get_userinfodata: function() {
    let that = this
    wx.showLoading()
    wx:wx.request({
      url: api.data.hehuoren,
      data: {
        openId: app.globalData.openid,
      },
      success: function(res) {
        if(res.data.state == 200) {
          that.setData({
            user_data: res.data.date,
            user_status: res.data.permissions
          })
          if (res.data.noticePD){
            that.alert_notive(res.data.noticePD.ID, res.data.noticePD.MSG)
          }          
        }else{
          wx:wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
          })
        }
      },
      fail: function(res) {
        wx: wx.showModal({
          title: '提示',
          content: "网络有误,请稍后再试",
          showCancel: false,
          success:function() {
            wx.switchTab({
              url: '../index/index',
            })
          }
        })
      },
      complete: function(res) {
        wx.hideLoading()
      },
    })
  },
  // 签到模块
  qiandao_toggle: function() {
    var that = this
    wx:wx.showLoading({})
    that.qiandao()    
  },
  qiandao: function() {
    let that = this
    wx: wx.request({
      url: api.data.qiandao,
      data: {
        openId: app.globalData.openid,
      },
      success: function (res) {
        if (res.data.state == 200 ) {
          if (res.data.result.signState == 1) {
            that.setData({
              qiandao_btn: false,
            })
          }
          that.setData({            
            qiandao_day: res.data.result.CHECKTIMES,
            qiandao_show: !that.data.qiandao_show,
          })
        }else{
          wx: wx.showModal({
            title: '提示',
            content: "网络有误,请稍后再试",
            showCancel: false,
          })
        }
      },
      fail: function (res) {
        wx: wx.showModal({
          title: '提示',
          content: "网络有误,请稍后再试",
          showCancel: false,
        })
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })
    
  },
  hide_qiandao: function() {
    this.setData({
      qiandao_show: false,
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
    
    // return {
    //   title: '伴君美',
    //   path: '/pages/index/index?id=123',
    //   imageUrl: '../../image/index_banner.jpg',
    //   success: function (res) {
    //     wx.showToast({
    //       title: '分享成功'
    //     })
    //     console.log(res)
    //   },
    //   fail: function (res) {
    //     // 转发失败
    //     wx.showToast({
    //       title: '分享失败..',
    //       icon: 'none'
    //     })
    //     console.log(res)
    //   }
    // }
  }

})