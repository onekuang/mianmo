/* 
	传递进来的data格式
  case_list:[
    {id:1,link:'',img:'https://www.xsygood.com/wximage/case1.jpg',title:'',desc:'desc'},
    {id:2,link:'',img:'https://www.xsygood.com/wximage/case2.jpg',title:'',desc:'desc2'}
  ],
  // 案例列表点击
  case_list_click(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../article/article?id=${id}`
    })
  },
 */

