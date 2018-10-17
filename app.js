//app.js
var api = require('./utils/api.js');
App({
  onLaunch: function () {
    let that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.code = res.code
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log('已授权')
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          console.log('未授权')
          wx.navigateTo({
            url: "/pages/accredit/index"
          })
        }
      }
    })    
  },  
  k_share: function() {
    var id = this.globalData.openid;
    return {
      title: '伴君美',
      path: '/pages/index/index?id=' + id,
      imageUrl: '../../image/index_banner.jpg',
      success: function (res) {
        wx.showToast({
          title: '分享成功'
        })
        console.log(res)
      },
      fail: function (res) {
        // 转发失败 
        wx.showToast({
          title: '分享失败..',
          icon: 'none'
        })
        console.log(res)
      }
    }
  },
  // 检测时候有openid
  has_openid(){
    var that = this;
    let storage_id = wx.getStorageSync('openid');

    if (that.globalData.openid == null) {
      // 如果openid为空,检查storage有没有id
      if (storage_id) {
        console.log('storage存在id')

        wx:wx.request({
          url: api.data.checkopenid,
          data: {
            openId: storage_id
          },
          success: function(res) {
            if(res.data.state == 200) {
              that.globalData.openid = storage_id
            }else{
              wx.navigateTo({
                url: "/pages/accredit/index"
              }) 
            }
          }
        })
      }else{
        wx.navigateTo({
          url: "/pages/accredit/index"
        }) 
      }      
    }
    
    return
    console.log('app=> 判断是否有openid')
    if (that.globalData.openid != null){
      return
    }
    
    // wx.getStorageSync({
    //   key: 'openid',
    //   success: function (res) {
    //     console.log('从storage获取openid')
    //     that.globalData.openid = res.data
    //     console.log(that.globalData.openid)
    //   },
    //   fail:function(res) {
    //     console.log('从storage获取不到id,跳转')
    //     wx.navigateTo({
    //       url: "/pages/accredit/index"
    //     }) 
    //   }
    // })  
    var openid = wx.getStorageSync('openid');
    var openid = that.globalData.openid
    if(!openid){
      wx:wx.showModal({
        title: 'has获取不到id',
        success: function(res) {
          wx.navigateTo({
            url: "/pages/accredit/index"
          }) 
        },
        fail: function(res) {},
        complete: function(res) {},
      })
      console.log('从storage获取不到id,跳转到授权页面')
      
    }else{
      console.log('从storage获取openid :' + that.globalData.openid)
      that.globalData.openid = openid
    }

    // if (that.globalData.openid == null) {
    //   wx.navigateTo({
    //     url: "/pages/accredit/index"
    //   }) 
    // }  
  },

  goto(e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  globalData: {
    code:null,
    openid: null,
    parent_id:null, // 上级id
    userInfo: null
  }
})