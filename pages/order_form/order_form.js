const { Tab, extend } = require('../templates/zan/index')


Page(extend({}, Tab, {
  data: {
    tab1: {
      list: [
        {
          id: 'all',
          title: '全部'
        }, {
          id: 'topay',
          title: '待付款'
        }, {
          id: 'tosend',
          title: '待发货'
        }, {
          id: 'send',
          title: '待收货'
        }, 
        {
          id: 'sign',
          title: '已完成订单'
        }
      ],
      selectedId: 'all',
      scroll: true,
      height: 45
    },
    tab_id: 'all',
    // 订单列表
    orders:[
      {
        "number": "123456789",
        "thumb": "../../image/logo_xs.png",
        "name": "APP定制",
        "count": 1,
        "status": "待付款",
        "money": 23333
      },
      {
        "number": "ASDFGHJKL",
        "thumb": "../../image/logo_xs.png",
        "name": "APP定制",
        "count": 2,
        "status": "待付款",
        "money": 23333
      }
    ]
  },

  handleZanTabChange(e) {
    console.log(e)
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId,
      tab_id:selectedId
    });
  },

  payOrders(e) {
    wx.navigateTo({
      url:'../order_pay/order_pay'
    })
  },
  
  onLoad: function (options) {
    let self = this
    if (options.id) {
      let selectedId = options.id
    }else{
      return
    }
    
    this.setData({
      [`tab1.selectedId`]: selectedId,
      tab_id:selectedId
    });
      // console.log(this.data.tab_id)
  }
}));