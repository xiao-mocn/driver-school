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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  previewImage: function (e) {
    console.log('e ===', e)
    const imageUrl = e.currentTarget.dataset.imageurl
    // 在小程序中实现图片预览
    wx.previewImage({
      current: '当前显示图片的链接', // 当前显示图片的链接，可不填或为空字符串
      urls: [imageUrl], // 需要预览的图片链接列表
      zoom: true, // 开启缩放功能
      success: function(res) {
        console.log('预览成功', res);
      },
      fail: function(res) {
        console.error('预览失败', res);
      }
    });
  },
})