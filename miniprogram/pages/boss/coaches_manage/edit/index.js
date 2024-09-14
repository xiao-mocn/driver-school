//获取应用实例
import callCloudFunction from '../../../utils/cloudFunctionUtils'
import { uploadFileToCloud } from '../../../utils/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      name: '',
      password: '',
      idCard: '',
      phone: '',
      gender: 'man',
      genderLabel: '男',
      birthday: '2000-01-01',
      registerType: 'coach',
      registerTypeLabel: '教练',
      avatar: '',
      carType: 'C1',
      carTypes: ['C1', 'C2', 'C3', 'C4'],
      schoolName: '安职喜来场',
      description: '',
      subject2Price: 68,
      subject3Price: 68,
      subject2Income: 15,
      subject3Income: 15,
      
    },
    schools: ['安职喜来场', '华城工业场', '里建华城场', '南师大红岭冠武场'],
    genders: [{label: '男', value: 'man'}, {label: '女', value: 'woman'}],
    registerTypes: [{label: '学员', value: 'student'}, {label: '教练', value: 'coach'}],
    carTypes: ['C1', 'C2', 'C3', 'C4', 'A1', 'A2', 'A3', 'B1', 'B2', 'D', 'E', 'F'],
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.on('acceptDataFromOpenerPage', (data) => {
        console.log('data ==', data);
        this.setData({
          formData: {
            ...data
          }
        })
      })
    }
  },
  fieldChange(e) {
    const fieldName = e.currentTarget.dataset.name;
    this.setData({
      ['formData.' + fieldName]: e.detail.value
    });
  },
  pickerChange(e) {
    console.log(e)
    const value = e.detail.value
    const fieldName = e.currentTarget.dataset.name;
    const range = e.currentTarget.dataset.range
    if (fieldName === 'schoolName') {
      this.setData({
        ['formData.schoolName']: this.data.schools[value]
      });
      return
    }
    this.setData({
      ['formData.' + fieldName + 'Label']: this.data[range][value].label,
      ['formData.' + fieldName]: this.data[range][value].value
    })
  },
  onPickerChange(e) {
    const fieldName = e.currentTarget.dataset.name;
    const value = this.data.carTypes[e.detail.value]
    this.setData({
      ['formData.' + fieldName]: value
    });
    let carTypes = []
    if (fieldName === 'carType') {
      switch (value) {
        case 'C1':
          carTypes = ['C1', 'C2', 'C3', 'C4']
          break;
        case 'C2':
          carTypes = ['C2']
          break;
        case 'C3':
          carTypes = ['C3']
          break;
        case 'C4':
          carTypes = ['C4']
          break;
        case 'A1':
          carTypes = ['C1', 'C2', 'C3', 'C4', 'A1', 'A3', 'B1', 'B2']
          break;
        case 'A2':
          carTypes = ['C1', 'C2', 'C3', 'C4', 'A2', 'B1', 'B2']
          break;
        case 'A3':
          carTypes = ['C1', 'C2', 'C3', 'C4', 'A3']
          break;
        case 'B1':
          carTypes = ['C1', 'C2', 'C3', 'C4', 'B1']
          break;
        case 'B2':
          carTypes = ['C1', 'C2', 'C3', 'C4', 'B2']
          break;
        case 'D':
          carTypes = ['D']
          break;
        case 'E':
          carTypes = ['E']
          break;
        case 'F':
          carTypes = ['F']
          break;
      }
      this.setData({
        ['formData.carTypes']: carTypes
      });
    }
  },
  uploadImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
      success: (res) => {
        console.log('res ====', res)
        const tempFilePath = res.tempFiles[0].path;
        const timestamp = new Date().getTime();
        // 使用封装的上传函数
        uploadFileToCloud(tempFilePath, `${ timestamp }.png`,  this.data.formData.avatar, )
          .then(fileID => {
            console.log('File ID:', fileID);
            this.setData({
              ['formData.avatar']: `${fileID}`
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
    const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    const phoneReg = /^1[3-9]\d{9}$/
    if (!this.data.formData.name) {
      wx.showToast({
        title: '请输入账号名',
        icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!this.data.formData.password) {
      wx.showToast({
        title: '请输入账号密码',
        icon: 'none', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!this.data.formData.idCard) {
      wx.showToast({
        title: '请输入身份证',
        icon: 'none', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!idCardReg.test(this.data.formData.idCard)) {
      wx.showToast({
        title: '身份证不正确',
        icon: 'none', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!this.data.formData.phone) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!phoneReg.test(this.data.formData.phone)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!this.data.formData.schoolName) {
      wx.showToast({
        title: '请输入驾校名称',
        icon: 'none', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!this.data.formData.subject2Price) {
      wx.showToast({
        title: '请输入科目二价格',
        icon: 'none', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (!this.data.formData.subject3Price) {
      wx.showToast({
        title: '请输入科目三价格',
        icon: 'none', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      return
    }
    if (this.data.formData.pageType === 'edit') {
      this.callFunctionUpdate()
    } else {
      this.callFunctionAdd()
    }
  },
  callFunctionAdd() {
    let params = {
      type: 'manager', // 调用管理模块
      moduleType: 'coach', // 调用学员下的接口
      functionType: 'add',
      data: {
        ...this.data.formData,
        monthlyOrderInfo: {},
        selectedDates: [],
        starscore: 5,
        studentCount: 0,
        totalOrdNum: 0,
        incomeNum: 0,
        withdrawableIncome: 0
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
  },
  callFunctionUpdate() {
    let params = {
      type: 'manager', // 调用管理模块
      moduleType: 'coach', // 调用学员下的接口
      functionType: 'update',
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