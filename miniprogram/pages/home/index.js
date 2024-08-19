//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loginType: 'student'
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
      loginType: userInfo.loginType || 'student'
    })
    this.initData()
  },
  initData() {
    const loginType = this.data.loginType
    const componentName = loginType === 'student' ? 'studentHome' : loginType === 'coach' ? 'coachHome' : 'bossHome'
    const component = this.selectComponent(`#${componentName}`)
    console.log(component)
    if (component) {
      component.initData()
    }
  }
})