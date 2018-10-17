var commonCityData = require('../../utils/city.js')
var app = getApp()
var api = require('../../utils/api.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    o_sheng:[],
    o_shi: [],
    o_qu: [],
    sheng: ['请选择'],
    shengIndex: 0,

    shi: ['请选择'],
    shiIndex: 0,

    qu: ["请选择"],
    quIndex: 0,

    username: '',
    phone: '',
    youzheng:'',
    mark:'',
    sheng_id: '',
    shi_id: '',
    qu_id:'',
  },
  onLoad:function() {
    this.get_sheng(1)
  },
  get_sheng:function(id) {
    let that = this
    let s = [];
    wx: wx.request({
      url: api.data.get_site_sheng,
      data: {
        addressId :id
      },
      success: function (res) {
        that.data.o_sheng = res.data.data
        that.data.o_sheng.forEach(function(item,index){
          s.push(item.name)
        })
        that.setData({
          sheng:s
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 省
  bindshengChange: function(e) {
    let index = e.detail.value
    let id =this.data.o_sheng[index].id
    this.setData({
      sheng_id:id,
      shengIndex: e.detail.value
    })
    this.get_shi(id)
  },
  bindshiChange: function(e) {
    let index = e.detail.value
    let id = this.data.o_shi[index].id
    this.setData({
      shi_id:id,
      shiIndex: e.detail.value
    })
    this.get_qu(id)
  },
  bindquChange: function (e) {
    let index = e.detail.value
    let id = this.data.o_qu[index].id
    this.setData({
      qu_id:id,
      quIndex: e.detail.value
    })
  },


  // 获取市
  get_shi: function (id) {
    let that = this
    let s = [];
    wx: wx.request({
      url: api.data.get_site_shiqu,
      data: {
        addressId: id
      },
      success: function (res) {
        that.data.o_shi = res.data.data
        that.data.o_shi.forEach(function (item, index) {
          s.push(item.name)
        })
        that.setData({
          shi: s
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 获取区
  get_qu: function (id) {
    let that = this
    let s = [];
    wx: wx.request({
      url: api.data.get_site_shiqu,
      data: {
        addressId: id
      },
      success: function (res) {
        that.data.o_qu = res.data.data
        that.data.o_qu.forEach(function (item, index) {
          s.push(item.name)
        })
        that.setData({
          qu: s,
          qu_id:that.data.o_qu[0].id
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  bindname:function(e) {
    var val = e.detail.value;
    this.setData({
      username: val
    });
  },
  bindphone: function (e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    });
  },
  bindyoubian: function (e) {
    var val = e.detail.value;
    this.setData({
      youbian: val
    });
  },
  bindmark: function (e) {
    var val = e.detail.value;
    this.setData({
      mark: val
    });
  },

  // 提交
  save:function() {
    let that = this
    if (this.data.username == "") {
      wx.showModal({
        title: '提示',
        content: '请填写收件人',
        showCancel: false
      })
      return
    }
    if (this.data.phone == "" || !/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.data.phone)) {
      wx.showModal({
        title: '提示',
        content: '请填写正确手机号码',
        showCancel: false
      })
      return
    }
    if (this.data.youbian == "") {
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel: false
      })
      return
    }
    if (this.data.sheng_id == "" || this.data.shi_id == "") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    wx:wx.request({
      url: api.data.send_site,
      data: {
        openId: app.globalData.openid,
        province: that.data.sheng_id,
        city: that.data.shi_id,
        zone: that.data.qu_id,
        addressDetail:that.data.mark,
        userName:that.data.username,
        mobile:that.data.phone,
        postCode: that.data.youbian
      },
      success: function(res) {
        if(res.data.state == 200) {
          wx:wx.navigateTo({
            url: '../select-address/index',
          })
        }else{
          wx:wx.showToast({
            title: res.data.state
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.k_share();
  }
})
