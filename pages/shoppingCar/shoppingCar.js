//index.js
var app = getApp()
var api = require('../../utils/api.js');


Page({
  data: {
    goodsList: {
      saveHidden: true,
      totalPrice: 0,
      allSelect: true,
      noSelect: false,
      list: []
    },
    delBtnWidth: 120,    //删除按钮宽度单位（rpx）
  },

  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);  //以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  onLoad: function () {

    let that = this


    this.initEleWidth();
    this.onShow();

    // 隐藏红点
    wx.hideTabBarRedDot({
      index: 2,
    })

  },
  onShow: function () {
    var shopList = [];
    // 获取购物车数据
    var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
    if (shopCarInfoMem && shopCarInfoMem.shopList) {
      shopList = shopCarInfoMem.shopList
    }
    this.data.goodsList.list = shopList;
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), shopList);
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/list/list"
    });
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var index = e.currentTarget.dataset.index;

    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) {//移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        }
      }
      var list = this.data.goodsList.list;
      if (index != "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },

  touchE: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      var list = this.data.goodsList.list;
      if (index !== "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);

      }
    }
  },
  // 滑动删除
  delItem: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    console.log(list[index].goodsId) // 商品id
    list.splice(index, 1);
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    return
  },
  selectTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      list[parseInt(index)].active = !list[parseInt(index)].active;
      this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    }
  },
  totalPrice: function () {
    var list = this.data.goodsList.list;
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        total += parseFloat(curItem.price) * curItem.number;
      }
    }
    total = parseFloat(total.toFixed(2));//js浮点计算bug，取两位小数精度 
    return total;
  },
  allSelect: function () {
    var list = this.data.goodsList.list;
    var allSelect = false;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },
  noSelect: function () {
    var list = this.data.goodsList.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.active) {
        noSelect++;
      }
    }
    if (noSelect == list.length) {
      return true;
    } else {
      return false;
    }
  },
  setGoodsList: function (saveHidden, total, allSelect, noSelect, list) {
    this.setData({
      goodsList: {
        saveHidden: saveHidden,
        totalPrice: total,
        allSelect: allSelect,
        noSelect: noSelect,
        list: list
      }
    });
    var shopCarInfo = {};
    var tempNumber = 0;
    shopCarInfo.shopList = list;
    for (var i = 0; i < list.length; i++) {
      tempNumber = tempNumber + list[i].number
    }
    shopCarInfo.shopNum = tempNumber;
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
  },
  bindAllSelect: function () {
    var currentAllSelect = this.data.goodsList.allSelect;
    var list = this.data.goodsList.list;
    if (currentAllSelect) {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = false;
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = true;
      }
    }

    this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
  },
  jiaBtnTap: function (e) {
    // let id = e.target.dataset.id
    // wx: wx.request({
    //   url: api.data.shopcart_num_add,
    //   data: {
    //     openId: app.globalData.openid,
    //     goodsId: id
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number < 10) {
        list[parseInt(index)].number++;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  jianBtnTap: function (e) {
    // let num = e.target.dataset.num
    // if(num <= 1) {
    //   return
    // }
    // let id = e.target.dataset.id
    // wx: wx.request({
    //   url: api.data.shopcart_num_jian,
    //   data: {
    //     openId: app.globalData.openid,
    //     goodsId: id
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number > 1) {
        list[parseInt(index)].number--;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
      }
    }
  },
  editTap: function () {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = false;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  saveTap: function () {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = true;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  getSaveHide: function () {
    var saveHidden = this.data.goodsList.saveHidden;
    return saveHidden;
  },
  deleteSelected: function () {
    var list = this.data.goodsList.list;
    list = list.filter(function (curGoods) {
      return !curGoods.active;
    });
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },

  // 结算

  toPayOrder: function () {
    wx.showLoading();
    var that = this;
    if (this.data.goodsList.noSelect) {
      wx.hideLoading();
      return;
    }
    // 重新计算价格，判断库存
    var shopList = [];
    var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
    if (shopCarInfoMem && shopCarInfoMem.shopList) {
      shopList = shopCarInfoMem.shopList.filter(entity => {
        return entity.active;
      });
    }
    if (shopList.length == 0) {
      wx.hideLoading();
      return;
    }
    var isFail = false;
    var doneNumber = 0;
    var needDoneNUmber = shopList.length;
    for (let i = 0; i < shopList.length; i++) {
      if (isFail) {
        wx.hideLoading();
        return;
      }
      let carShopBean = shopList[i];
      // 获取价格和库存
      this.navigateToPayOrder();
      return
      if (!carShopBean.propertyChildIds || carShopBean.propertyChildIds == "") {
        console.log(carShopBean)
        // console.log('发送请求')
        wx.showModal({
          title: '提示',
          content: '结算失败',
          showCancel: false
        })
        wx.hideLoading();

        // wx.request({
        //   url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/shop/goods/detail',
        //   data: {
        //     id: carShopBean.goodsId
        //   },
        //   success: function(res) {
        //     doneNumber++;
        //     if (res.data.data.properties) {
        //       wx.showModal({
        //         title: '提示',
        //         content: res.data.data.basicInfo.name + ' 商品已失效，请重新购买',
        //         showCancel:false
        //       })
        //       isFail = true;
        //       wx.hideLoading();
        //       return;
        //     }
        //     if (res.data.data.basicInfo.stores < carShopBean.number) {
        //       wx.showModal({
        //         title: '提示',
        //         content: res.data.data.basicInfo.name + ' 库存不足，请重新购买',
        //         showCancel:false
        //       })
        //       isFail = true;
        //       wx.hideLoading();
        //       return;
        //     }
        //     if (res.data.data.basicInfo.minPrice != carShopBean.price) {
        //       wx.showModal({
        //         title: '提示',
        //         content: res.data.data.basicInfo.name + ' 价格有调整，请重新购买',
        //         showCancel:false
        //       })
        //       isFail = true;
        //       wx.hideLoading();
        //       return;
        //     }
        //     if (needDoneNUmber == doneNumber) {
        //       that.navigateToPayOrder();
        //     }
        //   }
        // })
      } else {
        // wx.hideLoading();
        this.navigateToPayOrder();
        //   wx.request({
        //     url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/shop/goods/price',
        //     data: {
        //       goodsId: carShopBean.goodsId,
        //       propertyChildIds:carShopBean.propertyChildIds
        //     },
        //     success: function(res) {
        //       doneNumber++;
        //       if (res.data.data.stores < carShopBean.number) {
        //         wx.showModal({
        //           title: '提示',
        //           content: carShopBean.name + ' 库存不足，请重新购买',
        //           showCancel:false
        //         })
        //         isFail = true;
        //         wx.hideLoading();
        //         return;
        //       }
        //       if (res.data.data.price != carShopBean.price) {
        //         wx.showModal({
        //           title: '提示',
        //           content: carShopBean.name + ' 价格有调整，请重新购买',
        //           showCancel:false
        //         })
        //         isFail = true;
        //         wx.hideLoading();
        //         return;
        //       }
        //       if (needDoneNUmber == doneNumber) {
        //         that.navigateToPayOrder();
        //       }
        //     }
        //   })
      }
    }
  },
  navigateToPayOrder: function () {
    wx.hideLoading();
    wx.navigateTo({
      url: "/pages/order_pay/order_pay"
    })
  },

  arr_to_obj: function (arr) {
    let obj = {}
    for (var i = arr.length - 1; i >= 0; i--) {
      console.log(arr[i])
    }
  },
  //  生命周期函数--监听页面隐藏
  onHide: function () {
    // fn 每次离开购物车页面时,数据保存到到云端
    let storage_data = wx.getStorageSync('shopCarInfo');
    let number = storage_data.shopNum;
    let list = storage_data.shopList

    let postlist = [];
    for (var i = 0; i < list.length; i++) {
      let postlist_item = {};
      postlist_item.id = list[i].goodsId
      postlist_item.number = list[i].number
      postlist.push(postlist_item)
    }
    let postobj = {};
    postobj.list = postlist;

    console.log()
    // postobj.openid =app.globalData.openid;

    // postobj.number = number;
    // wx.request({
    //   url: api.data.post_shopCar,
    //   method:'POST',
    //   data: {
    //     openid: app.globalData.openid,
    //     data  : JSON.stringify(postobj)
    //   },
    //   success: function(res) {
    //     console.log(res);
    //   }
    // })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.k_share();
  }
})
