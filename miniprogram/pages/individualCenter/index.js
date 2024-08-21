//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    registerType: '',
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({
      userInfo,
      registerType: userInfo.registerType || 'student'
    })
    this.initComponentData()
  },
  initComponentData() {
    const registerType = this.data.registerType
    const componentName = registerType === 'student' ? 'studentUser' : registerType === 'coach' ? 'coachUser' : 'bossUser'
    const component = this.selectComponent(`#${componentName}`)
    console.log('user ====', registerType, component)
    if (component) {
      component.initData()
    }
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