var app = getApp()
var api = require('../../utils/api.js');

Page({
  data: {
    user_data: '', // 用户数据
    user_status: '', // 用户身份

    bindphone:0, // 绑定的手机
    bankList: [], // 用户银行列表数据
    tixianjine1: '', // 销售奖励
    tixianjine2:'', // 分润奖励
    jiangli: 1, // 奖励类型
    money:'', // 提现金额
    code:'',
    showTopTips: false,

    code_time: 60,
    code_time_show: false,
    interval:'',

    radioItems: [
      { name: '销售奖励', value: '1',checked: true},
      { name: '分红奖励', value: '2' }
    ],

    accounts: [],    // 选择栏 展示银行列表的name
    accountIndex: '', // 选择的银行索引,获取对应的银行id

    isAgree: false
  },
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
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
  // 双向绑定银行列表的值
  bindAccountChange: function (e) {
    this.setData({
      accountIndex: e.detail.value
    })
  },
  // 双向绑定提现金额 
  getmoney:function(e) {
    this.setData({
      money: e.detail.value
    })
  },
  // 双向绑定验证码
  bindcode:function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 点击提现按钮
    openConfirm: function () {
      let that = this
      console.log(that.data.bindphone)
      console.log(that.data.money)
      console.log(that.data.jiangli)
      let bank_item = that.data.bankList[that.data.accountIndex]

      let bank = bank_item

      if (that.data.bindphone && that.data.money && that.data.jiangli && that.data.jiangli && bank_item) {
  
      }else{
        wx.showToast({
          title: '信息不能为空',
        })
        return
      }
      if (that.data.money == 0) {
        wx.showToast({
          title: '金额不能是0',
        })
        return
      }
      if (!/^[0-9]*$/.test(that.data.money) ) {
        wx.showToast({
          title: '金额只能是整数',
        })
        return
      }
      wx.showModal({
        title: '银行卡确认',
        content: bank.USERNAME + bank.CARNUMBER,
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '请稍等',
            })
            wx:wx.request({
              url: api.data.tixian_send,
              data: {
                openId: app.globalData.openid,
                bankcardID: bank.ID,
                meney: that.data.money,
                isBlance: that.data.jiangli,
                code: that.data.code,
              },
              success: function(res) {
                if(res.data.state == 200) {
                  // wx:wx.showModal({
                  //   title: '提示',
                  //   content: res.data.msg,
                  //   showCancel: false,
                  // })
                  // wx.showToast({
                  //   title: res.data.msg,
                  // })
                  // that.onShow()
                  wx.switchTab({
                    url: '../center/center',
                  })
                }
              },
              fail: function(res) {},
              complete: function(res) {
                wx.hideLoading()
                wx: wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false,
                })
              },
            })
          } else {
            console.log('取消')
          }
        }
      });
    },
    get_data: function () {
      var that = this;
      wx.showLoading({
        title: '加载中'
      }),
        wx.request({
          url: api.data.get_bank_list,
          data: {
            openId: app.globalData.openid
          },
          success: function (res) {            
            let arr = []
            let a = res.data.date
            a.forEach(function(item,index) {
              arr.push(item.BANK + '-' +item.CARNUMBER)
            })
            that.setData({
              accounts: arr,
              bankList: res.data.date,              
            })
          },
          fail: function (res) { },
          complete: function (res) {
            wx.hideLoading()
          },
        })

        wx.request({
          url: api.data.tixianinit,
          data:{
            openId: app.globalData.openid
          },
          success: function (res) {
            if (res.data.state == 201) {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                success: function (res) {
                  wx: wx.switchTab({
                    url: '/pages/center/center',
                  })
                },
              })
              // wx.showToast({
              //   title: res.data.msg,
              // })
              // wx: wx.navigateTo({
              //   url: '../chang_user_info/index'
              // })
              return
            }        
            that.setData({
              tixianjine1: res.data.data.balance,
              tixianjine2: res.data.data.shareProfit,
              bindphone: res.data.data.mobile
            })
            if (!that.data.bindphone) {
              wx.showModal({
                title: '提示',
                content: '请先绑定手机',
                showCancel: true,
                success: function(res) {
                  wx: wx.switchTab({
                    url: '/pages/center/center',
                  })
                  return
                },
                fail: function(res) {},
                complete: function(res) {},
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
    // 点击获取验证码
    getcode : function() {
      let that = this;
      that.start_time()
      wx.request({
        url: api.data.tixian_code,
        data: {
          openId: app.globalData.openid
        },
        success: function (res) {
            wx.showToast({
              title: res.data.msg
            })
        },
        fail: function (res) {
          wx.showToast({
            title: res.data.msg,
          })
          that.stop_time()
        },
        complete: function (res) {},
      })
    },    
    onShow:function() {
      this.get_data()
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
          if (that.data.user_status == 0) {
            wx:wx.showModal({
              title: '提示',
              content: '目前等级无权限提现',
              cancelText: '取消',
              confirmText: '如何升级',
              success: function(res) {
                if(res.confirm) {
                  wx:wx.navigateTo({
                    url: '../fenxiaotext/fenxiaotext',
                  })
                  return
                }else{
                  wx:wx.switchTab({
                    url: '../center/center',
                  })
                  return
                }
              },
              fail: function(res) {},
              complete: function(res) {},
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

  start_time() {
    let that = this
    that.setData({
      code_time_show: true
    }) 
    let times = 60
    that.data.interval = setInterval(function() {
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
    },1000)    
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.k_share();
  }



});