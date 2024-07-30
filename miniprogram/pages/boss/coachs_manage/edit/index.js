//获取应用实例
import { envId } from "../../../../envList";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      name: '莫荣包',
      idCard: '452724199605032538',
      birthday: '2024-01-01',
      gender: 'man',
      phone: '15051836908',
      school: '上海驾校',
      carType: 'C1'
    },
    envId: envId,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    const { type, id } = option
    wx.setNavigationBarTitle({
      title: type === 'add' ? '新增' : '编辑'
    });
    if (type === 'edit') {
      this.getCoachInfo(id)
    }
  },
  getCoachInfo: function (id) {
  },
  handleButtonClick() {
    const { name, idCard, phone, school } = this.data.formData
    const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
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
    if (!school) {
      wx.showModal({
        title: '请输入驾校名称',
        icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!idCardReg.test(idCard)) {
      wx.showModal({
        title: '身份证格式不正确',
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
    console.log(this.data.formData, this.data?.envId)
    wx.showLoading({
      title: '正在提交',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: 'dev-module-3g8dv9dob670ce47',
      },
      data: {
        type: 'getOpenId',
        collectionName: 'students'
      },
    })
    .then((resp) => {
      console.log('resp ===', resp);
      wx.hideLoading();
      wx.showToast({
        title: '新增成功',
        icon: 'success', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
    })
    .catch((err) => {
      console.log('err ==', err);
      wx.showToast({
        title: '提交失败',
      })
    })
    
  },
  handleRadioChange(e) {
    const fieldName = e.currentTarget.dataset.name;
    this.setData({
      ['formData.' + fieldName]: e.detail.value
    });
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
  }
})