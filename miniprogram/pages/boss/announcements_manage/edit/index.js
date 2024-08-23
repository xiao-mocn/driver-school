//获取应用实例
import callCloudFunction from '../../../utils/cloudFunctionUtils'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData()
  },
  initData() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log('data ==', data);
      this.setData({
        formData: data.data
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
    const { title, content, type } = this.data.formData
    if (!title) {
      wx.showToast({
        title: '请输入标题',
        icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (type === 'add') {
      this.callFunctionAdd()
    } else {
      this.callFunctionUpdate()
    }
  },
  callFunctionAdd() {
    wx.showLoading({
      title: '正在提交',
    });
    callCloudFunction('quickstartFunctions', {
      type: 'defaultAdd',
      collectionName: 'announcements',
      data: {
        ...this.data.formData
      }
    }).then((resp) => {
      console.log('resp ==', resp);
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      })
    }).catch((err) => {
      console.log('err ==', err);
      wx.showToast({
        title: err || '新增失败',
      })
      wx.hideLoading();
    })
  },
  callFunctionUpdate() {
    wx.showLoading({
      title: '正在提交',
    });
    callCloudFunction('quickstartFunctions', {
      type: 'defaultUpdate',
      collectionName: 'announcements',
      _id: this.data.formData._id,
      data: {
        ...this.data.formData
      }
    }).then((resp) => {
      console.log('resp ==', resp);
      wx.hideLoading();
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