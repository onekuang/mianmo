//获取应用实例 
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl:api.imgurl,
    // 选项卡
    // tabs: ["商品详情", "商品评价", "商品参数"],
    tabs: ["商品详情", "商品参数"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,


    // 商品id
    goods_id: '',
    // 分享出去的标题和图片
    share_title: "伴君美",
    share_img: "http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg",
    // 轮播
    imgUrls: [
      { id: '1', url: 'http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg' },
      { id: '2', url: 'http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg' }
    ],
    // 商品data
    goodsDetail: {
      basicInfo: {
        id: 6761,
        logisticsId: 386,
        name: "伴君美面膜",
        pic: "http://image1.sansancloud.com/jiafang/2017_12/19/11/48/22_343.jpg",
        weight: 0,
        numberOrders: 233, // 销量
        commissionType: 1,
        commission: 5, // 分享积分
        numberGoodReputation: '233', // 好评次数,
        chandi: '产地',
        guige:'规格',
      }
    },
    // 评价
    reputation: [
      {
        usersLogo: 'http://image1.sansancloud.com/jianzhan/2017_11/08/20/44/32_860.jpg?x-oss-process=style/preview',
        usersName: '',
        productName: '面膜',
        registerDate: '1525413919000',
        content: '哎哟,不错哟~'
      },
      {
        usersLogo: 'http://image1.sansancloud.com/jianzhan/2017_11/08/20/44/32_860.jpg?x-oss-process=style/preview',
        usersName: '',
        productName: '面膜',
        registerDate: '1525413919000',
        content: '大吉大利,今晚吃鸡~'
      }
    ],
    
    hideShopPopup: true,    // 购物车是否隐藏
    selectSizePrice: 0, // 价格
    shopCarInfo: {},
    shopNum: 0,
    hideShopPopup: true,
    text: "产品图文介绍...",

    // 加入购物车内
    buyNumMin: 1,
    buyNumMax: 99,
    buyNumber: 1,

    propertyChildIds: "",
    propertyChildNames: "",
    //购物类型，加入购物车或立即购买，默认为加入购物车
    shopType: "addShopCar",
  },

  // 点击-加入购物车-显示
  toAddShopCar() {
    this.setData({
      shopType: "addShopCar"
    });
    this.setData({
      hideShopPopup: !this.data.hideShopPopup
    })
  },
  closePopupTap() {
    this.setData({
      hideShopPopup: !this.data.hideShopPopup
    })
  },

  numJianTap() {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap() {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  /**
   * 组建购物车信息
   */
  bulidShopCarInfo: function () {
    // 加入购物车
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;

    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    // shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.currend_number = this.data.buyNumber;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    // shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;

    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    return shopCarInfo;
  },



  // 加入购物车

  addShopCar: function () {
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo();
    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    });
    // 写入本地存储
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })

    let current_num = this.data.buyNumber

    wx.request({
      url: api.data.add_shop_car,
      data: {
        openId: app.globalData.openid,
        goodsId: this.data.goods_id,
        goodsNum: current_num
      },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '加入失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
    this.closePopupTap();


    shopCarInfo = {shopNum:12,shopList:[]}
  },
  // 购物车
  goShopCar() {
    wx.switchTab({
      url: '../shoppingCar/shoppingCar'
    })
  },

  // 立即购买
  tobuy() {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap()
    // wx.navigateTo({
    //   url:'../order_pay/order_pay'
    // })
  },
  // 规格选择弹出框
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false
    })
  },

  // 立即购买

  buyNow: function () {
    this.bindGuiGeTap();
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建立即购买信息
    var buyNowInfo = this.buliduBuyNowInfo();
    console.log(buyNowInfo);
    // 写入本地存储
    wx.setStorage({
      key: "buyNowInfo",
      data: buyNowInfo
    })
    this.closePopupTap();
    wx.navigateTo({
      url: "../order_pay/order_pay?orderType=buyNow"
    })
  },
  // 组建立即购买信息
  buliduBuyNowInfo: function () {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    // shopCarMap.propertyChildIds = this.data.propertyChildIds;
    // shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    // shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

    var buyNowInfo = {};
    if (!buyNowInfo.shopNum) {
      buyNowInfo.shopNum = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    buyNowInfo.shopList.push(shopCarMap);
    return buyNowInfo;
  },

  // 富文本插件
  wxparse: function (text) {
    WxParse.wxParse('article', 'html', text, this, 5);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    var query = options.id.split(',')
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    // wx.showLoading();
    that.setData({
      goods_id: options.id
    })
    let id = this.data.goods_id
    if(id == 16) {
      wx:wx.showModal({
        title: '提示',
        content: '伴君美大礼包如需自由搭配,可在下单时中备注.',
        showCancel: false,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    // let id  = 14
    let url = api.data.goods

  // =========================================================================================================
    let goods_id = 'goodsDetail.basicInfo.id'
    let goods_pic = 'goodsDetail.basicInfo.pic'
    let goods_name = 'goodsDetail.basicInfo.name'
    let goods_jifen = 'goodsDetail.basicInfo.commission'
    let goods_haoping = 'goodsDetail.basicInfo.numberGoodReputation'
    let goods_xiaoliang = 'goodsDetail.basicInfo.numberOrders'
    let goods_guige = 'goodsDetail.basicInfo.guige'
    let goods_chandi = 'goodsDetail.basicInfo.chandi'

    wx.showLoading({
      title: '加载中'
    })
    // 产品轮播请求
    wx.request({
      url:url,
      data:{
        id:id
      },
      success:function(res) {
        if(res.data.state == 200) {
          that.setData({
            imgUrls:res.data.img,
            text:res.data.goods.INFO, // 产品介绍
            // goodsDetail
            [goods_id]: res.data.goods.ID,
            [goods_name]: res.data.goods.TRADENAME,
            [goods_guige]: res.data.goods.SPECIFICATION,
            [goods_pic]: that.data.imgurl + res.data.goods.LOGO,
            [goods_chandi]:res.data.goods.LOCATION,
            selectSizePrice: res.data.goods.PRICE,
          })
          // 将HTML的标签转换成小程序能识别的
          that.wxparse(that.data.text)

          wx.hideLoading();
        }else{
          wx.hideLoading();
          wx.showToast({
            title: '网络有误'
          })
        }
      }
    })

    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        that.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        });
      }
    })    
  },


  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
    return app.k_share();
  }
})