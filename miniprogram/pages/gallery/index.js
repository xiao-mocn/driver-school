//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    textInfo: {
      title: '',
      list: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getTextInfo()
  },
  getTextInfo: function () {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log('data ==', data);
      this.setData({
        textInfo: data.data
      });
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
})