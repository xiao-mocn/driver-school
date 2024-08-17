import callCloudFunction from '../utils/cloudFunctionUtils'
//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    userInfo: null
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }
    this.setData({
      formData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      userInfo
    })
  },
  inputChange(e) {
    const fieldName = e.currentTarget.dataset.name;
    this.setData({
      ['formData.' + fieldName]: e.detail.value
    });
  },
  handleCancel() {
    wx.navigateBack({
      delta: 1
    })
  },
  handleButtonClick() {
    console.log(this.data.formData)
    if (!this.data.formData.oldPassword) {
      wx.showToast({
        title: '请输入旧密码',
        icon: 'none'
      })
      return
    }
    if (!this.data.formData.newPassword) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      })
      return
    }
    if (!this.data.formData.confirmPassword) {
      wx.showToast({
        title: '请输入确认密码',
        icon: 'none'
      })
      return
    }
    if (this.data.formData.newPassword !== this.data.formData.confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
      return
    }
    callCloudFunction('quickstartFunctions', {
      type: 'editPassWord',
      userId: this.data.userInfo._id,
      collectionName: this.data.userInfo.loginType === 'student' ? 'students' : 'coaches',
      oldPassword: this.data.formData.oldPassword,
      newPassword: this.data.formData.newPassword
    }).then(res => {
      wx.showToast({
        title: '修改成功',
        icon: 'success'
      })
      wx.navigateBack({})
    }).catch((err) => {
      wx.showToast({
        title: err || '修改失败',
        icon: 'none'
      })
    })
  }
})