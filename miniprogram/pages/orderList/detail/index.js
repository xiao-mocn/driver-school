//获取应用实例
import { images } from "../../const/index"
import callCloudFunction from '../../utils/cloudFunctionUtils'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    images,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
      return
    }
    this.getOrderInfo()
  },
  getOrderInfo: function () {
    wx.showLoading({
      title: '正在提交',
      mask: true
    });
    callCloudFunction('quickstartFunctions', {
      type: 'selectRecord',
      collectionName: 'orders',
      _id: 'af813b1066df058a00ad638a5dc5e9bc'
    }).then((resp) => {
      console.log('resp ====', resp)
      wx.hideLoading()
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: err || '查询失败,请重试',
      })
    })
  },
  handleCancel() {
    wx.navigateBack({
      delta: 1 // 返回到上级页面
    });
  },
  handleButtonClick() {
  },
  callFunctionAdd() {
  }
})