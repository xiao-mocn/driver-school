//获取应用实例
import { images } from "../../../const/index";
import callCloudFunction from '../../../utils/cloudFunctionUtils'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      name: '',
      idCard: '',
      birthday: '2024-01-01',
      gender: 'man',
      starscore: 5,
      studentCount: 0,
      phone: '',
      school: '',
      classType: 'beginner',
      carType: 'C1',
      studentCount: 0,
      todayOrdNum: 0,
      monthOdrNum: 0,
      incomeNum: 0,
      withdrawableIncome: 0
    },
    pageType: '',
    images,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    const { type } = option
    this.setData({
      pageType: type
    })
    wx.setNavigationBarTitle({
      title: type === 'add' ? '新增' : '编辑'
    });
    this.getCoachInfo()
  },
  getCoachInfo: function () {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log('data ==', data);
      this.setData({
        formData: data.data
      });
    });
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
    if (this.data.pageType === 'edit') {
      this.callFunctionUpdate()
    } else {
      this.callFunctionAdd()
    }
  },
  // 新增
  callFunctionAdd() {
    wx.showLoading({
      title: '正在提交',
    });
    callCloudFunction('quickstartFunctions', {
      type: 'addRecord',
      collectionName: 'coaches',
      data: this.data.formData
    })
    .then((resp) => {
      wx.hideLoading();
      wx.showToast({
        title: '新增成功',
        icon: 'success', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      wx.navigateBack({
        delta: 1 // 返回到上级页面
      });
    })
    .catch((err) => {
      wx.showToast({
        title: err || '提交失败',
      })
    })
  },
  // 更新
  callFunctionUpdate() {
    wx.showLoading({
      title: '正在提交',
    });
    callCloudFunction('quickstartFunctions', {
      type: 'updateRecord',
      collectionName: 'coaches',
      data: this.data.formData
    })
    .then((resp) => {
      console.log('resp ==', resp);
      wx.hideLoading();
      wx.showToast({
        title: '更新成功',
        icon: 'success', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      wx.navigateBack({
        delta: 1 // 返回到上级页面
      });
    })
    .catch((err) => {
      console.log('err ==', err);
      wx.showToast({
        title: err || '更新失败',
      })
    })
  },
  handleCancel() {
    wx.navigateBack({
      delta: 1  // 返回到上级页面
    });
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