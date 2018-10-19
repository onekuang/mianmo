// var baseURL = 'http://192.168.1.2:8280';
// var baseURL = 'http://192.168.1.7:8080';
// var baseURL = 'http://192.168.4.115:8280';
var baseURL = 'http://192.168.4.118:8180/bjm-xcx/';
// var baseURL = 'https://bjm.smilehehe.com';

var data = {
  checkopenid: '/wechatexistsopenid', //

  // 首页
  index_swiper:'/wechatpicenterindexlist', // 首页轮播图
  send_userinfo: "/wechatauthorization", // 发送授权信息和code
	
  goods_list: '/wechatgoodsindex',  // 商品列表	
  goods: '/wechatgoodsdetails', // 商品详情
	
  add_shop_car: '/wechataddtoshoppingcar',// 商品详情 => 点击加入购物车

	// 查询购物车
  select_car: '/wechatlistAll',
  
  shopcart_num_add: '/wechataddnum',// 购物车商品递增 ++
  shopcart_num_jian: '/wechatdeletenum',// 购物车商品递减 --

	// 保存购物车数据
	post_shopCar: '/v1/wechat/pub/editcarproduct.json',

  shopcart_select: '/wechatlistAll', // 查询购物车列表 
  createdOrder: '/wechatcreateorder', // 创建订单 

  get_bankcard_list: '/wechatusercard', // 添加银行卡时,获取所有银行list
  send_bank_add: '/wechatusercardadd', // 提交添加银行卡
  
  get_bank_list: '/wechatusercardindex', // 获取用户的银行卡列表
  bank_delete: '/wechatusercarddel', // 删除银行卡


  // 绑定手机

  // 公告
  noticelist: '/wechatnoticelist', // 公告列表
  notice_detaile: '/wechatfindnoticebyid', // 公告详情

  get_site_list: '/wechataddresslist', // 获取省市区
  get_site_sheng: '/wechataddressDepthlist', // 获取省市区
  get_site_shiqu: '/wechataddresslist', // 获取省市区


  send_site: '/wechataddressadd', // 保存地址
  get_site_userlist:'/wechataddressindex', // 获取用户地址列表
  site_delete: '/wechataddressdelete', // 删除地址

  // 分销中心
  fenxiao_center:'/wechatuserdistribution',
  fenxiao_list: '/wechatuserrecommendedList', // 分销中心list

  // 获取微信支付配置
  get_payconfig: '/wechatpay',
  
  send_pay: '',// 发送支付请求

  // 提现
  tixianinit: '/applymoney', // 获得基础信息
  tixian_code: '/wechatapplymobileSms', // 获取验证码
  tixian_send: '/wechatusercardApplyadd', // 提现提交
  tixianlist: '/wechatcashapplylist', // 提现记录


  // 修改用户信息
  get_phone_data: '/wechatuserMobileOR', // 检查是否已经版多过手机.
  get_phone_code: '/wechatuserMobileSms', // 绑定手机号码 => 获取验证码
  send_bindphone: '/wechatuserMobile', // 绑定手机

  // 订单
  get_orderlist: '/wechatorderlist', // 获取所有列表
  cancle_order: '/wechatcancleorder', // 取消订单
  detaile_order:'/wechatfindorderbyid', // 订单详情
  // 快递
  order_kuaidi: '/wechatuserordertraces', // 快递详情
  shouhuo: '/wechatordersuccess', // 确认收货

  // 实物奖励
  shiwujiangli:'/wechatSalesStatis',

  // 合伙人销售商,基础信息
  hehuoren: '/wechatuserdistribution',

  // 转账
  zhuanzhang:"/wechatusertransfer",
  // 订单更改收货地址
  orchang_site: "/wechateidtOrderaddess",

  // 生成二维码
  qrcode: "/wechatgetaccesstoken", // 获取token
  get_qrcode: "/wechatxcxqrcode", // 发送token 获取二维码

  // 获取快递单号:
  get_kuaididanhao: "/wechatuserorderexpnum",
  qiandao: "/wechatpay_signin",

  // 获取团队无线级详情
  team_list: "/wechatchildrenlist",

  // 到期警告
  infodange: "/wechatpay_v2_hint"
}

for (var i in data) {
  data[i] = baseURL + data[i]
}

module.exports = {
  imgurl: 'https://bjm.smilehehe.com/uploadFiles/uploadImgs/',
  data: data
}