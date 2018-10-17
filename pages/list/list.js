var api = require('../../utils/api.js');
const app = getApp()
Page({
  data: {
    imgurl: api.imgurl,
    // category: [
    //   {
    //     "id": "ruanjian",
    //     "logo": "http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg",
    //     "name": "限时优惠",
    //     "productList": [
    //       {
    //         "id": "1",
    //         "logo": "http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg",
    //         "name": "男面膜"
    //       },
    //       {
    //         "id": "2",
    //         "logo": "http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg",
    //         "name": "女面膜"
    //       },
    //       {
    //         "id": "3",
    //         "logo": "http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg",
    //         "name": "套装面膜"
    //       }
    //     ]
    //   },
    //   {
    //     "id": "ruanjian2",
    //     "logo": "http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg",
    //     "name": "热销产品",
    //     "productList": [
    //       {
    //         "id": "1",
    //         "logo": "http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg",
    //         "name": "男面膜"
    //       },
    //       {
    //         "id": "2",
    //         "logo": "http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg",
    //         "name": "女面膜"
    //       },
    //       {
    //         "id": "3",
    //         "logo": "http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg",
    //         "name": "套装面膜"
    //       }
    //     ]
    //   }
    // ],
    category:[],
    curIndex: 0,
    isScroll: false,
    toView: 'top'
  },
  onLoad() {
    var that = this

    // 接口地址
    let url = api.data.goods_list
    wx.request({
      url: url,
      success: function (res) {
        if (res.data.state == 200) {
          that.setData({
            category: res.data.data
          })
        }
      }
    })
  },
  onReady() {
  },



  switchTab(e) {
    const that = this;
    this.setData({
      isScroll: true
    })
    setTimeout(function () {
      that.setData({
        toView: e.target.dataset.id,
        curIndex: e.target.dataset.index
      })
    }, 0)
    setTimeout(function () {
      that.setData({
        isScroll: false
      })
    }, 1)

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.k_share();
  }
})