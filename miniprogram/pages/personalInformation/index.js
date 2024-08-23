//获取应用实例
import callCloudFunction from '../utils/cloudFunctionUtils'
import { uploadFileToCloud } from '../utils/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    registerType: '',
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
      registerType: userInfo.registerType || 'student'
    })
  },
  fieldChange(e) {
    const fieldName = e.currentTarget.dataset.name;
    this.setData({
      ['formData.' + fieldName]: e.detail.value
    });
  },
  uploadImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
      success: (res) => {
        const tempFilePath = res.tempFiles[0].path;
        const timestamp = new Date().getTime();
        uploadFileToCloud(tempFilePath, `${timestamp}.png`, this.data.formData.avatar)
          .then(fileID => {
            console.log('File ID:', fileID);
            this.setData({
              ['formData.avatar']: fileID
            })
            wx.showToast({
              title: '上传成功',
              icon: 'none'
            });
          })
          .catch(err => {
            console.error('Upload failed:', err);
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
          });
      },
      fail: (err) => {
        console.error('File selection failed:', err);
      }
    });
  },
  handleButtonClick() {
    const { name, phone } = this.data.formData
    const phoneReg = /^1[3-9]\d{9}$/
    if (!name) {
      wx.showToast({
        title: '请输入账号名',
        icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!phone) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    this.callFunctionUpdate()
  },
  callFunctionUpdate() {
    let params = {}
    if (this.data.formData.registerType === 'student') {
      params = {
        type: 'manager', // 调用管理模块
        moduleType: 'student', // 调用学员下的接口
        functionType: 'update',
        data: this.data.formData
      }
    } else {
      params = {
        type: 'manager', // 调用管理模块
        moduleType: 'coach', // 调用教练下的接口
        functionType: 'update',
        data: this.data.formData
      }
    }
    wx.showLoading({
      title: '正在提交',
    });
    callCloudFunction('quickstartFunctions', {
      ...params
    }).then((resp) => {
      console.log('resp ==', resp);
      wx.hideLoading();
      wx.setStorageSync('userInfo', this.data.formData)
      wx.navigateBack({
        delta: 1
      })
    }).catch((err) => {
      console.log('err ==', err);
      wx.showToast({
        title: err || '更新失败',
      })
    })
  }
})