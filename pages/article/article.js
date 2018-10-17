var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return app.k_share();
  }


  
})