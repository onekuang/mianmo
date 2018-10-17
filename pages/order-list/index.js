// var wxpay = require('../../utils/pay.js')
var app = getApp()
var api = require('../../utils/api.js');
Page({
  data:{
    imgurl: api.imgurl,
    statusType: ["待付款", "待发货", "待收货","已完成"],
    currentType:2,
    tabClass: ["", "", "", "", ""],

    orderList:[
      // {
      //   id:0,
      //   status:0,
      //   orderNumber:'23333333333333',
      //   dateAdd:'2018-2-12 14:00:00',
      //   statusStr:'未付款',
      //   remark:'备注留言',
      //   amountReal:'23333',
      //   goodsMap:[
      //     {'pic':'../../image/logo_xs.png'}
      //   ]
      // },
      // {
      //   id:1,
      //   status:2,
      //   orderNumber:'23333333333333',
      //   dateAdd:'2018-2-12 14:00:00',
      //   statusStr:'待发货',
      //   remark:'备注留言',
      //   amountReal:'23333',
      //   goodsMap:[
      //     {'pic':'../../image/logo_xs.png'}
      //   ]
      // }
    ],
    // 缩列图 
    goodsMap:[
      // [
      //   {'pic':'../../image/logo_xs.png'},
      //   {'pic':'../../image/logo_xs.png'},
      // ],
      // [
      //   {'pic':'../../image/logo_xs.png'},
      //   {'pic':'../../image/logo_xs.png'},
      //   {'pic':'../../image/logo_xs.png'},
      //   { 'pic': '../../image/logo_xs.png' },
      //   { 'pic': '../../image/logo_xs.png' },
      //   {'pic':'../../image/logo_xs.png'},
      // ]        
    ]
  },
  statusTap:function(e){
     var curType =  e.currentTarget.dataset.index;
     this.data.currentType = curType
     this.setData({
       currentType:curType
     });
     this.onShow();
  },
  orderDetail : function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
     wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading();
          console.log(orderId)
          wx.request({
            url: api.data.cancle_order,
            data: {
              openId: app.globalData.openid,
              Id: orderId
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data.state == 200) {
                that.onShow();
              }
            }
          })
          wx.hideLoading();
        }
      }
    })
  },
  // 立即付款
  toPayTap:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;

    var pay_config = {
      // timeStamp: '',
      // nonce_str: '',
      // prepay_id: '',
      // paySign:''
    }

    wx:wx.showModal({
      title: '提示',
      content: '伴君美分享赚钱模式，不允许自己推自己另一个微信号、卡位架空，如果出现系统会直接自动锁定该帐号.将该账号架空人员面临扣除百分之五十的奖金拨比给上面的直接推荐的人！',
      showCancel: true,
      success: function(res) {
        if(res.confirm){
          wx: wx.request({
            url: api.data.get_payconfig,
            data: {
              openId: app.globalData.openid,
              Id: orderId
            },
            success: function (res) {
              pay_config = res.data
              // pay_config.timeStamp = res.data.timeStamp
              // pay_config.nonce_str = res.data.nonce_str
              // pay_config.prepay_id = res.data.prepay_id
              // pay_config.paySign = res.data.paySign
              console.log(pay_config.timeStamp)
              wx.requestPayment({
                'timeStamp': pay_config.timeStamp,
                'nonceStr': pay_config.nonce_str,
                'package': 'prepay_id=' + pay_config.prepay_id,
                'signType': 'MD5',
                'paySign': pay_config.paySign,
                'success': function (res) {
                  wx.showToast({
                    title: '支付成功',
                  })
                  that.onShow();
                },
                'fail': function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '支付失败',
                  })
                }
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }else{
          
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })


    return
    // =============================
    wx:wx.request({
      url: api.data.get_payconfig,
      data: {
        openId: app.globalData.openid,
        Id: orderId
      },
      success: function(res) {
        pay_config = res.data
        // pay_config.timeStamp = res.data.timeStamp
        // pay_config.nonce_str = res.data.nonce_str
        // pay_config.prepay_id = res.data.prepay_id
        // pay_config.paySign = res.data.paySign
        console.log(pay_config.timeStamp)
        wx.requestPayment({
          'timeStamp': pay_config.timeStamp,
          'nonceStr': pay_config.nonce_str,
          'package': 'prepay_id=' + pay_config.prepay_id,
          'signType': 'MD5',
          'paySign': pay_config.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
            })
            that.onShow();
          },
          'fail': function (res) {
            console.log(res)
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    // wx.request({
    //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
    //   data: {
    //     token: app.globalData.token
    //   },
    //   success: function (res) {
    //     if (res.data.code == 0) {
    //       // res.data.data.balance
    //       money = money - res.data.data.balance;
    //       if (money <= 0) {
    //         // 直接使用余额支付
    //         wx.request({
    //           url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/pay',
    //           method:'POST',
    //           header: {
    //             'content-type': 'application/x-www-form-urlencoded'
    //           },
    //           data: {
    //             token: app.globalData.token,
    //             orderId: orderId
    //           },
    //           success: function (res2) {
    //             that.onShow();
    //           }
    //         })
    //       } else {
    //         wxpay.wxpay(app, money, orderId, "/pages/order-list/index");
    //       }
    //     } else {
    //       wx.showModal({
    //         title: '错误',
    //         content: '无法获取用户资金信息',
    //         showCancel: false
    //       })
    //     }
    //   }
    // })    
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
   if(options.id) {
    this.setData({
      currentType: options.id
    })
   }
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
 
  },
  // 确认收货
  qurenshouhuo:function(e) {
    let that = this
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否确认收货',
      confirmText: "确认",
      cancelText: "取消",
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          wx: wx.request({
            url: api.data.shouhuo,
            data: {
              openId: app.globalData.openid,
              Id: orderId,
            },
            success: function (res) {
              
              if (res.data.state == 200) {
                wx: wx.showToast({
                  title: res.data.msg,
                  success: function (res) { },
                  fail: function (res) {},
                  complete: function (res) {
                    that.onShow();
                  },
                })
              }else{
                wx.showToast({
                  title: '确认失败',
                })
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }        
      }
    })
  },
  onShow:function(){
    app.has_openid();
    // 获取订单列表
    // wx.showLoading();
    var that = this;
    let list = []
    wx.request({
      url: api.data.get_orderlist,
      data: {
        openId: app.globalData.openid,
      },
      success: (res) => {
        if (res.data.state == 200) {
          
          let arr = res.data.result
          if(arr.length == 0) {
            return
          }else{
            arr.forEach(function(item,index) {
              let a = {
                id:item.id,
                status:item.status,
                orderNumber: item.orderNum,
                dateAdd: item.generateDate,
                goodsMap: item.logos,
                orderPrice: item.province,
                amountReal: item.orderPrice,
                remark: item.remark
              }
              list.push(a)
            })
            that.setData({
              orderList:list
            })
          }
          // that.setData({
          //   orderList: res.data.data.orderList,
          //   logisticsMap : res.data.data.logisticsMap,
          //   goodsMap : res.data.data.goodsMap
          // });
        } else {
          this.setData({
            orderList: null,
            logisticsMap: {},
            goodsMap: {}
          });
        }
      }
    })
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
 
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
 
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
   
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.k_share();
  }
})
