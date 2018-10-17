const app = getApp()
var api = require('../../utils/api.js');
Page({
  data: {
    name: '1',
    phone: '',
    bank_num:'',
    bank_id:'',
    // accounts: ["中国银行", "招商银行", "工商银行"],
    accounts: [],
    accountIndex: 0,
    banklist: [],
    isAgree: false
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    var that = this
    let arr = []
    wx.request({
      url: api.data.get_bankcard_list,
      success: function(res) {
        that.setData({
          banklist: res.data.date
        })
        let list = that.data.banklist
        for (let i = 0; i < list.length;i++) {
          console.log(list[i].NAME)
          arr.push(list[i].NAME)
        }
        that.setData({
          accounts: arr
        })
      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading()
      },
    })
  },

  // 选择银行
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    })
  },

  // 双向绑定
  getname: function(e) {
    var val = e.detail.value;
    this.setData({
      name: val
    });
  },
  getphone: function(e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    });
  },
  getbanknum: function (e) {
    var val = e.detail.value;
    this.setData({
      bank_num: val
    });
  },
  // 保存提交信息
  savebank: function(e){
    var that = this

    // 过滤下字段
    if (this.data.name == "" || that.data.bank_num == "") {
      wx.showModal({
        title: '提示',
        content: '信息不能为空',
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


    let index = that.data.accountIndex; // 选择银行的索引
    let bankid = that.data.banklist[index].ID

    
    wx.request({
      url: api.data.send_bank_add,
      data: {
        openId: app.globalData.openid,
        bankId: bankid,
        carNumber: that.data.bank_num,
        userName: that.data.name,
        mobile: that.data.phone
      },
      success: function(res) {
        if(res.data.state==200) {
          wx: wx.showToast({
            title: '保存成功',
          })
          wx.navigateTo({
            url: "../bank/bank"
          })
        }else{
          wx: wx.showToast({
            title: res.data.msg
          })
        }        
      },
      fail: function(res) {
        wx:wx.showToast({
          title: '网络失败,稍后在试'
        })
      },
      complete: function(res) {},
    })
  }
});