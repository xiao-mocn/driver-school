import { getUserProfile } from '../utils/index'
import { images } from "../const/index"
import callCloudFunction from '../utils/cloudFunctionUtils'
Page({
  data: {
    loginType: 'student',
    angle: 0,
    loginForm: {
      username: '',
      password: ''
    },
    checked: false,
    images,
  },
  onLoad: function(options) {
    const userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    if (userInfo && userInfo.isLogin) {
      wx.switchTab({
        url: '/pages/home/index'
      })
    }
  },
  handleChangeEntry(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      loginType: type
    })
  },
  submitLogin:async function (e) {
    const wxInfo = await getUserProfile()
    const username = e.detail.value.username;
    const password = e.detail.value.password;
    const type = this.data.loginType;
    console.log(username, password, type)
    if (username == '' || password == '') {
      wx.showToast({
        title: '请输入账号和密码',
        icon: 'none'
      })
      return
    }
    if (!this.data.checked) {
      wx.showToast({
        title: '请勾选用户隐私协议',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '正在登录',
    });
    switch (type) {
      case 'student':
        this.redirectToStudent(username, password, wxInfo)
        break;
      case 'coach':
        this.redirectToCoach(username, password, wxInfo)
        break;
      case 'boss':
        this.redirectToBoos(username, password, wxInfo)
    }
  },
  redirectToStudent(username, password, wxInfo) {
    callCloudFunction('quickstartFunctions', {
      type: 'login',
      collectionName: 'students',
      username,
      password,
      wxInfo,
      loginType: this.data.loginType
    }).then(res => {
      res.loginType = 'student'
      res.isLogin = true
      delete res.password
      wx.setStorageSync('userInfo', res)
      wx.switchTab({
        url: '/pages/home/index'
      })
      wx.hideLoading();
    }).catch(err => {
      wx.showToast({
        title: err || '账号密码错误，请重试',
        icon: 'none'
      })
      wx.hideLoading();
    })
  },
  redirectToCoach(username, password, wxInfo) {
    callCloudFunction('quickstartFunctions', {
      type: 'login',
      collectionName: 'coaches',
      username,
      password,
      wxInfo,
    }).then(res => {
      res.loginType = 'coach'
      res.isLogin = true
      delete res.password
      wx.setStorageSync('userInfo', res)
      // 获取 App 实例
      wx.switchTab({
        url: '/pages/home/index'
      })
      wx.hideLoading();
    }).catch(err => {
      wx.showToast({
        title: err || '账号密码错误，请重试',
        icon: 'none'
      })
      wx.hideLoading();
    })
  },
  redirectToBoos(username, password, wxInfo) {
    callCloudFunction('quickstartFunctions', {
      type: 'login',
      collectionName: 'boss',
      username,
      password,
      wxInfo,
    }).then(res => {
      res.loginType = 'boss'
      res.isLogin = true
      delete res.password
      wx.setStorageSync('userInfo', res)
      // 获取 App 实例
      wx.switchTab({
        url: '/pages/home/index'
      })
      wx.hideLoading();
    }).catch(err => {
      wx.showToast({
        title: err || '账号密码错误，请重试',
        icon: 'none'
      })
      wx.hideLoading();
    })
  },
  goToPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/index'
    })
  },
  handleCheck() {
    this.setData({
      checked: !this.data.checked
    })
  }
})