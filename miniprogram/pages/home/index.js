//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    registerType: ''
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
      registerType: userInfo.registerType || 'student'
    })
    this.initData()
  },
  initData() {
    const registerType = this.data.registerType
    const componentName = registerType === 'student' ? 'studentHome' : registerType === 'coach' ? 'coachHome' : 'bossHome'
    const component = this.selectComponent(`#${componentName}`)
    console.log(component)
    if (component) {
      component.initData()
    }
  }
})