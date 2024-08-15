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
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
      loginType: userInfo.loginType
    })
  },
  onReady: function () {
    this.initData()
  },
  initData() {
    const componentName = this.data.loginType === 'student' ? 'studentHome' : 'coachHome'
    const component = this.selectComponent(`#${componentName}`)
    console.log(component)
    if (component) {
      component.initData()
    }
  }
})