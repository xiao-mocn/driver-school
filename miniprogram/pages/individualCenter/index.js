//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loginType: 'student',
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync('userInfo') || {}
    console.log(userInfo)
    this.setData({
      userInfo,
      loginType: userInfo.loginType
    })
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