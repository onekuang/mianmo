var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
var api = require('../../utils/api.js');
Page({
  data: {
    user_data: '', // 用户数据
    user_status: '', // 用户身份
    lists:'', // 团队和帐变list

    tabs: ["我的团队", "奖励明细"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    //  user_status:2  //  0:正常,1:消费商,2:合伙人
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    // wx:wx.request({
    //   url: api.data.fenxiao_center,
    //   data: {
    //     openId: app.globalData.openid
    //   },
    //   success: function(res) {
    //     console.log(res.data)
    //   },
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  goto(e) {
    let url = e.currentTarget.dataset.url;

    wx.navigateTo({
      url: url
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.has_openid();
    this.get_userinfodata()
  },
  get_userinfodata: function () {
    let that = this
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
    wx: wx.request({
      url: api.data.fenxiao_list,
      data: {
        openId: app.globalData.openid,
      },
      success: function (res) {
        if (res.data.state == 200) {
          that.setData({
            lists: res.data.date,
          })
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
  gotodetail:function(e) {
    let that = this
    let id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: `../teamlist/teamlist?id=${id}`,
    })
    return
    wx: wx.request({
      url: api.data.team_list,
      data: {
        openId: id,
      },
      success: function (res) {
        if (res.data.state == 200) {
          that.setData({
            lists: res.data.date,
          })
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.k_share();
  }
});