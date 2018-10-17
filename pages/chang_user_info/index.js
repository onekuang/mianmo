var app = getApp()
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    phone:"",
    mobileType:0, // 新增1 更改2
    old_phone:'',

    code_time: 60,
    code_time_show: false,
    interval: '',
  },
  bindcode:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  bindphone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindoldphone: function(e) {
    this.setData({
      old_phone: e.detail.value
    })
  },
  getcode(e){
    let that = this
    if (this.data.phone == "" || !/^[1][3,4,6,5,7,8,9][0-9]{9}$/.test(this.data.phone)) {
      wx.showModal({
        title: '提示',
        content: '请填写正确手机号码',
        showCancel: false
      })
      return
    }
    that.start_time()
    wx:wx.request({
      url: api.data.get_phone_code,
      data: {
        openId: app.globalData.openid,
        mobile:that.data.phone
      },
      success: function(res) {
        wx.showToast({
          title: res.data.msg
        })
        console.log(res.data)
      },
      fail: function(res) {
        wx.showToast({
          title: res.data.msg,
        })
        that.stop_time()
      },
      complete: function(res) {},
    })
  },
  send_bindphone : function (){
    let that = this
    if (that.data.phone && that.data.code && that.data.mobileType) {

    }else{
      wx.showModal({
        title: '提示',
        content: '信息不能为空',
        showCancel: false
      })
      return
    }

    if (that.data.mobileType == 2){
      if (this.data.old_phone == "" || !/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.data.old_phone)){
        wx.showModal({
          title: '提示',
          content: '请填写正确手机号码o',
          showCancel: false
        })
        return
      }
    }
    if (this.data.phone == "" || !/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.data.phone)) {
      wx.showModal({
        title: '提示',
        content: '请填写正确手机号码',
        showCancel: false
      })
      return
    }
    wx.request({
      url: api.data.send_bindphone,
      data:{
        openId: app.globalData.openid,
        mobile: that.data.old_phone,
        code: that.data.code,
        newmobile: that.data.phone,
        mobileType: that.data.mobileType
      },
      success: function (res) {
        if(res.data.state == 200){
          wx:wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function(res) {
              wx: wx.switchTab({
                url: "../center/center",
              })
            },
            fail: function(res) {},
            complete: function(res) {},
          })          
        }else{
          wx:wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: true,
          })
        }   
      },
      fail: function (res) {
        wx.showToast({
          title: res.data.msg
        })
      }
    })
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
      title: '请稍等',
    })
    wx:wx.request({
      url: api.data.get_phone_data,
      data: {
        openId: app.globalData.openid,
      },
      success: function(res) {
        that.setData({
          mobileType: res.data.mobileType,
          old_phone: res.data.mobile
        })
        // console.log(res.data.mobileType)
      },
      fail: function(res) {},
      complete: function(res) {
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
  start_time() {
    let that = this
    that.setData({
      code_time_show: true
    })
    let times = 60
    that.data.interval = setInterval(function () {
      times--
      if (times <= 0) {
        // times = 60
        // clearInterval(that.data.interval)
        // that.setData({
        //   code_time_show: false
        // })        
        that.stop_time()
      }
      that.setData({
        code_time: times,

      })
    }, 1000)
  },
  stop_time() {
    let that = this
    if (that.data.interval) {
      let times = 60
      clearInterval(that.data.interval)
      that.setData({
        code_time: times,
        code_time_show: false
      })
    }
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