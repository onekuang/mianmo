var app = getApp()
var api = require('../../utils/api.js');

Page({
  data: {
    user_data: '', // 用户数据 
    user_status: '', // 用户身份
    bind_myphone:'', // 我的手机号
    bind_oppphone:'', // 对方的手机号
    bindphone: 0, // 绑定的手机
    jiangli: 1, // 奖励类型
    money: '', // 提现金额

    radioItems: [
      { name: '销售奖励', value: '1', checked: true },
      { name: '分红奖励', value: '2' }
    ],
  },
  radioChange: function (e) {

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });

    this.setData({
      jiangli: e.detail.value
    })
  },
  // 双向绑定 奖励类型
  bindCountryCodeChange: function (e) {
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  // 双向绑定提现金额 
  getmoney: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  // 双向绑定我的手机号
  bind_my_phone: function(e) {
    this.setData({
      bind_myphone: e.detail.value
    })
  },
  // 双向绑定对方手机号
  bind_opp_phone: function (e) {
    this.setData({
      bind_oppphone: e.detail.value
    })
  },
  // 点击提现按钮
  openConfirm: function () {
    let that = this

    if (this.data.bind_oppphone == "" 
      || !/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.data.bind_oppphone)
    ) {
      wx.showModal({
        title: '提示',
        content: '请填写正确手机号码',
        showCancel: false
      })
      return
    }
    if (that.data.money == 0){
      wx.showToast({
        title: '金额不能是0.',
      })
      return
    }
    if (!/^[0-9]*$/.test(that.data.money)) {
      wx.showToast({
        title: '金额只能是整数.',
      })
      return
    }

    wx:wx.showModal({
      title: '提示',
      content: '是否确定转账?',
      showCancel: true,
      success: function(res) {
        if(res.confirm) {
          wx: wx.request({
            url: api.data.zhuanzhang,
            data: {
              openId: app.globalData.openid,
              isBalance: that.data.jiangli,
              mobile: that.data.bind_oppphone,
              money: that.data.money
            },
            success: function (res) {
              if (res.data.state == 200) {
                wx: wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false,
                  success: function (res) {
                    // that.onShow() 
                    wx.switchTab({
                      url: '../center/center',
                    })
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false,
                })
              }

            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    
  },

  onShow: function () {
    this.get_userinfodata()
  },
  get_userinfodata: function () {
    let that = this
    wx:wx.request({
      url: api.data.get_phone_data,
      data: {
        openId: app.globalData.openid,
      },
      success: function(res) {
        console.log(res.data.mobileType)
        if (res.data.mobileType != 2){
          wx.showModal({
            title: '提示',
            content: '请先绑定手机',
            showCancel: true,
            success: function (res) {
              wx: wx.switchTab({
                url: '/pages/center/center',
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
          return
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.showLoading({
      title: '加载中'
    })
    wx: wx.request({
      url: api.data.hehuoren,
      data: {
        openId: app.globalData.openid,
      },
      success: function (res) {
        if (res.data.state == 200) {
          that.setData({
            user_data: res.data.date,
            user_status: res.data.permissions
          })
          if (that.data.user_status == 0) {
            wx: wx.showModal({
              title: '提示',
              content: '暂无权限',
              cancelText: '取消',
              confirmText: '如何升级',
              success: function (res) {
                if (res.confirm) {
                  wx: wx.navigateTo({
                    url: '../fenxiaotext/fenxiaotext',
                  })
                } else {
                  wx: wx.switchTab({
                    url: '../center/center',
                  })
                }
              },
              fail: function (res) { },
              complete: function (res) { },
            })
            return
          }
        } else {
          wx.showToast({
            title: res.data.state,
          })
        }
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },
  goto(e) {
    let url = e.currentTarget.dataset.url;

    wx.navigateTo({
      url: url
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.k_share();
  }

});