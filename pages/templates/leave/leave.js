Page({

	data: {
		// 留言字数
    text_cursor:0
	},

	// 留言的字数变化
  text_change(e) {
    console.log(123)
    let cursor = e.detail.cursor
    this.setData({
      text_cursor : cursor
    })
  },
  // 留言提交
  formSubmit(e){
    console.log(e.detail.value)
  }
})