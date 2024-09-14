//获取应用实例
import callCloudFunction from '../../utils/cloudFunctionUtils'
import { uploadFileToCloud } from '../../utils/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      defaultPrice: '',
    },
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.showLoading({
      title: '正在查询',
    });
    callCloudFunction('quickstartFunctions', {
      type: 'selectRecord', // 调用管理模块
      collectionName: 'defaultConfig',
      _id: '983e93c466e4f7b400c5bfd16e1c965f',
    }).then((res) => {
      console.log('res ===', res)
      this.setData({
        formData: {
          ...res
        }
      })
      wx.hideLoading();
    }).catch((err) => {
      wx.hideLoading();
      wx.showToast({
        title: err || '查询失败，请重试',
        icon: 'none'
      })
    })
  },
  fieldChange(e) {
    const fieldName = e.currentTarget.dataset.name;
    this.setData({
      ['formData.' + fieldName]: e.detail.value
    });
  },
  handleButtonClick() {
    this.callFunctionUpdate()
  },
  callFunctionUpdate() {
    let params = {
      type: 'defaultUpdate', // 调用管理模块
      _id: '983e93c466e4f7b400c5bfd16e1c965f',
      collectionName: 'defaultConfig',
      data: {
        ...this.data.formData
      }
    }
    wx.showLoading({
      title: '正在提交',
    });
    callCloudFunction('quickstartFunctions', {
      ...params
    }).then((res) => {
      console.log('res ===', res)
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      })
    }).catch((err) => {
      wx.hideLoading();
      wx.showToast({
        title: err || '提交失败',
        icon: 'none'
      })
    })
  }
})