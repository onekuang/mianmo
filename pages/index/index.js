//index.js
//获取应用实例
const app = getApp()
var api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    autopay: false, 
    paystart:true,
    imgurl: api.imgurl,
    // 轮播
    imgUrls: [
      'http://tp5test.cms.sppcms.com/img/ban1.jpg',
      'http://tp5test.cms.sppcms.com/img/ban2.jpg',
      'http://tp5test.cms.sppcms.com/img/ban3.jpg'
    ],
    test:1,
  },
  goto(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  payvideo() {
    this.setData({
      autopay: true,
      paystart: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that = this
    
    if (options.id) {
      var query = options.id.split(',')
      app.globalData.parent_id = query[0];
      console.log('上级id为:' + app.globalData.parent_id)
    }else{
      console.log('无上级分享')
    }



    if(options.scene) {
      app.globalData.parent_id = options.scene
      console.log('上级二维码id为:' + app.globalData.parent_id)
    } else {
      console.log('无二维码上级分享')
    }

    wx:wx.request({
      url: api.data.index_swiper,
      data: '',
      success: function(res) {
        that.setData({
          imgUrls:res.data.result
        })
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {}
    });  
  },
  swiper_goto: function(e) {
    let id = e.target.dataset.id
    wx.navigateTo({
      url: '../goodsdetaile/goodsdetaile?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {    
    app.has_openid();
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.k_share();
  }
})
