//index.js
//获取应用实例 
var app = getApp()
var api = require('../../utils/api.js');
Page({
  data: {
    sitedata:[],
    siteid:'',
    goodsList:[],
    isNeedLogistics:0, // 是否需要物流信息
    allGoodsPrice:0,
    yunPrice:0,
    allGoodsAndYunPrice:0,
    goodsJsonStr:"",
    orderType:"", //订单类型，购物车下单或立即支付下单，默认是购物车，

    hasNoCoupons: true,
    coupons: [],
    youhuijine:0, //优惠券金额
    curCoupon:null // 当前选择使用的优惠券
  },
  // 选择地址
  selsectsite(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      siteid:id
    })
  },
  // 获取地址列表
  get_sitelist:function(){
    let that = this
    wx:wx.request({
      url: api.data.get_site_userlist,
      data: {
        openId: app.globalData.openid
      },
      success: function(res) {
        console.log(res.data.data[0])
        that.setData({
          sitedata: res.data.data,
          siteid: res.data.data[0].id
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onShow : function () {
    var that = this;
    var shopList = [];
    this.get_sitelist()
    //立即购买下单
    if ("buyNow"==that.data.orderType){
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    }else{
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        // shopList = shopCarInfoMem.shopList
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: shopList,
    });
    // =============================================================
    that.initShippingAddress();
  },

  onLoad: function (e) {
    var that = this;
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1, 
      orderType: e.orderType
    });
  },

  getDistrictId : function (obj, aaa){
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },

  createOrder:function (e) {
    // console.log(this.data.goodsList);
    
    var that = this;
    if (that.data.siteid == '') {
      wx:wx.showModal({
        title: '提示',
        content: '你还未选择地址',
        showCancel: false,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }
    wx.showLoading();
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }

    let IDS = []
    let NUM = []
    // openId = odb_i5ClnBuK2ESLzuKIqnXtVYdU & DATA_IDS=14, 16 & addressId=1 & userName=1 & NUM_IDS=1, 1
    this.data.goodsList.forEach(function(item,index){
      // k_list.push({
      //   DATA_IDS: item.goodsId,
      //   NUM_IDS: item.number,
      // })
      IDS.push(item.goodsId),
        NUM.push(item.number)
    })

    let str1 = IDS.join(',')
    let str2 = NUM.join(',')
    var postData = {
      openId: app.globalData.openid,
      DATA_IDS: str1,
      NUM_IDS: str2,
      addressId: that.data.siteid,
      remark: remark
    }


    // var postData = {
    //   goodsJsonStr: that.data.goodsJsonStr,
    //   remark: remark
    // };
    // if (that.data.isNeedLogistics > 0) {
    //   if (!that.data.curAddressData) {
    //     wx.hideLoading();
    //     wx.showModal({
    //       title: '错误',
    //       content: '请先设置您的收货地址！',
    //       showCancel: false
    //     })
    //     return;
    //   }
    //   postData.provinceId = that.data.curAddressData.provinceId;
    //   postData.cityId = that.data.curAddressData.cityId;
    //   if (that.data.curAddressData.districtId) {
    //     postData.districtId = that.data.curAddressData.districtId;
    //   }
    //   postData.address = that.data.curAddressData.address;
    //   postData.linkMan = that.data.curAddressData.linkMan;
    //   postData.mobile = that.data.curAddressData.mobile;
    //   postData.code = that.data.curAddressData.code;
    // }
    if (that.data.curCoupon) {
      postData.couponId = that.data.curCoupon.id;
    }
    if (!e) {
      postData.calculate = "true";
    }

    console.log(postData)
    wx.request({
      url: api.data.createdOrder,
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: postData, // 设置请求的 参数
      success: (res) =>{
        wx.hideLoading();
        if (res.data.state != 200) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }

        if (e && "buyNow" != that.data.orderType) {
          // 清空购物车数据
          wx.removeStorageSync('shopCarInfo');
        }
        if (!e) {
          that.setData({
            isNeedLogistics: res.data.data.isNeedLogistics,
            allGoodsPrice: res.data.data.amountTotle,
            allGoodsAndYunPrice: res.data.data.amountLogistics + res.data.data.amountTotle,
            yunPrice: res.data.data.amountLogistics
          });
          that.getMyCoupons();
          return;
        }
        // 配置模板消息推送
        // var postJsonString = {};
        // postJsonString.keyword1 = { value: res.data.data.dateAdd, color: '#173177' }
        // postJsonString.keyword2 = { value: res.data.data.amountReal + '元', color: '#173177' }
        // postJsonString.keyword3 = { value: res.data.data.orderNumber, color: '#173177' }
        // postJsonString.keyword4 = { value: '订单已关闭', color: '#173177' }
        // postJsonString.keyword5 = { value: '您可以重新下单，请在30分钟内完成支付', color:'#173177'}
        // app.sendTempleMsg(res.data.data.id, -1,
        //   'mGVFc31MYNMoR9Z-A9yeVVYLIVGphUVcK2-S2UdZHmg', e.detail.formId,
        //   'pages/index/index', JSON.stringify(postJsonString));
        // postJsonString = {};
        // postJsonString.keyword1 = { value: '您的订单已发货，请注意查收', color: '#173177' }
        // postJsonString.keyword2 = { value: res.data.data.orderNumber, color: '#173177' }
        // postJsonString.keyword3 = { value: res.data.data.dateAdd, color: '#173177' }
        // app.sendTempleMsg(res.data.data.id, 2,
        //   'Arm2aS1rsklRuJSrfz-QVoyUzLVmU2vEMn_HgMxuegw', e.detail.formId,
        //   'pages/order-details/index?id=' + res.data.data.id, JSON.stringify(postJsonString));
        // 下单成功，跳转到订单管理界面
        wx.redirectTo({
          url: "/pages/order-list/index?id=0"
        });
      }
    })
  },
  initShippingAddress: function () {
    var that = this;
    // wx.request({
    //   url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/shipping-address/default',
    //   data: {
    //     token:app.globalData.token
    //   },
    //   success: (res) =>{
    //     if (res.data.code == 0) {
    //       that.setData({
    //         curAddressData:res.data.data
    //       });
    //     }else{
    //       that.setData({
    //         curAddressData: null
    //       });
    //     }
    //     that.processYunfei();
    //   }
    // })
  },
  processYunfei: function () {
    var that = this;
    var goodsList = this.data.goodsList;
    var goodsJsonStr = "[";
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;

    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      if (carShopBean.logistics) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.price * carShopBean.number;

      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }


      let inviter_id = 0;
      let inviter_id_storge = wx.getStorageSync('inviter_id_' + carShopBean.goodsId);
      if (inviter_id_storge) {
        inviter_id = inviter_id_storge;
      }


      goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + ',"propertyChildIds":"' + carShopBean.propertyChildIds + '","logisticsType":0, "inviter_id":' + inviter_id +'}';
      goodsJsonStr += goodsJsonStrTmp;


    }
    goodsJsonStr += "]";
    //console.log(goodsJsonStr);
    that.setData({
      isNeedLogistics: isNeedLogistics,
      goodsJsonStr: goodsJsonStr
    });
    that.createOrder();
  },
  addAddress: function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url:"/pages/select-address/index"
    })
  },
  getMyCoupons: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/my',
      data: {
        token: app.globalData.token,
        status:0
      },
      success: function (res) {
        if (res.data.code == 0) {
          var coupons = res.data.data.filter(entity => {
            return entity.moneyHreshold <= that.data.allGoodsAndYunPrice;
          });
          if (coupons.length > 0) {
            that.setData({
              hasNoCoupons: false,
              coupons: coupons
            });
          }
        }
      }
    })
  },
  bindChangeCoupon: function (e) {
    const selIndex = e.detail.value[0] - 1;
    if (selIndex == -1) {
      this.setData({
        youhuijine: 0,
        curCoupon:null
      });
      return;
    }
    //console.log("selIndex:" + selIndex);
    this.setData({
      youhuijine: this.data.coupons[selIndex].money,
      curCoupon: this.data.coupons[selIndex]
    });
  }
})
