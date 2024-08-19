//获取应用实例
import callCloudFunction from '../utils/cloudFunctionUtils'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    loginType: '',
    genders: ['男', '女']
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/login/index'
      });
      return
    }
    this.setData({
      formData: userInfo,
      loginType: userInfo.loginType || 'student'
    })
  },
  handleRadioChange(e) {
    wx.showToast({
      title: '暂不支持修改性别',
      icon: 'none'
    })
  },
  inputChange(e) {
    const fieldName = e.currentTarget.dataset.name;
    this.setData({
      ['formData.' + fieldName]: e.detail.value
    });
  },
  bindDateChange(e) {
    const fieldName = e.currentTarget.dataset.name;
    this.setData({
      ['formData.' + fieldName]: e.detail.value
    });
  },
  handleButtonClick() {
    const { name, idCard, phone } = this.data.formData
    const phoneReg = /^1[3-9]\d{9}$/
    if (!name) {
      wx.showModal({
        title: '请输入名字',
        icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!idCard) {
      wx.showModal({
        title: '请输入身份证',
        icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!phone) {
      wx.showModal({
        title: '请输入手机号码',
        icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!phoneReg.test(phone)) {
      wx.showModal({
        title: '手机号码格式不正确',
        icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    this.callFunctionUpdate()
  },
  callFunctionUpdate() {
    const loginType = this.data.loginType
    const collectionName = loginType === 'student' ? 'students' : 'coaches'
    wx.showLoading({
      title: '正在提交',
    });
    callCloudFunction('quickstartFunctions', {
      type: 'updateRecord',
      collectionName,
      data: {
        ...this.data.formData
      }
    }).then((res) => {
      console.log(res)
      wx.hideLoading();
      wx.setStorageSync('userInfo', res)
      wx.navigateBack({
        delta: 1
      })
    }).catch((err) => {
      wx.hideLoading();
      wx.showToast({
        title: '提交失败',
        icon: 'none'
      })
    })
  }
})