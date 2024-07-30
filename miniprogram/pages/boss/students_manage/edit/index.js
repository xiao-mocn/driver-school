//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '1996-01-01',
    checkedValue: 'man',
    items: [
      { value: 'option1', name: 'Option 1', checked: false },
      { value: 'option2', name: 'Option 2', checked: false }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '学员新增'
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
  handleButtonClick() {

  },
  handleRadioChange(e) {
    console.log(e);
    this.setData({
      checkedValue: e.detail.value
    });
  },
  checkboxChange(e) {
    const values = e.detail.value;
    const items = this.data.items.map(item => ({
      ...item,
      checked: values.includes(item.value)
    }));
    this.setData({
      items
    });
  }
})