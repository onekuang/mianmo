
//     mune_data: [
//       {id:'1',url:'',icon:'shouji',title:'微信小程序',bg_color:'#44E2C2'},
//       {id:'2',url:'',icon:'iconfontweixin',title:'微信公众号',bg_color:'#36D6EE'},
//       {id:'3',url:'',icon:'gongsizhanlve-',title:'营销外包',bg_color:'#3692F9'},
//       {id:'4',url:'',icon:'xiangmuxuqiu-',title:'企业网站建设',bg_color:'#FD434C'},
//       {id:'5',url:'',icon:'diqiu',title:'营销网站推广',bg_color:'#FFAF32'},
//       {id:'6',url:'',icon:'xiangmuguzhi-',title:'电商平台开发',bg_color:'#AA51FC'}, 
//     ]	
Component({
	options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
   properties: {
   	mune_data: {
   		type: Array
   		// value:''
   	}
   },

   /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
   data: {

   },

   /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
   methods: {
   	// 菜单点击
 		mune_click(e) {
	    let id = e.currentTarget.dataset.id
	    let url = e.currentTarget.dataset.url

      // this.triggerEvent('mune_click');

      // return
	    wx.navigateTo({
	      url: `${url}?id=${id}`
	    })
	  }
   }



})