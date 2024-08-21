import { images } from "../../const/index"
import callCloudFunction from '../../utils/cloudFunctionUtils'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coachList: [],
    isRefreshing: false,
    searchQuery: '',
    images,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getCoachList()
  },
  getCoachList: function () {
    wx.showLoading({
      title: '',
    });
    const data = {}
    if (this.data.searchQuery) {
      data.name = this.data.searchQuery
    }
    callCloudFunction('quickstartFunctions', {
      type: 'manager', // 调用管理模块
      moduleType: 'coach', // 调用教练下的接口
      functionType: 'queryList', // 查询列表
      ...data
    }).then(res => {
      console.log('res ===', res)
      this.setData({
        coachList: res,
        isRefreshing: false
      })
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    })
  },
  onConfirm(e) {
    console.log('e ===', e)
    const value = e.detail.value
    this.setData({
      searchQuery: value
    })
    this.getCoachList()
  },
  onInput(e) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  handleAppointment (e) {
    const info = e.currentTarget.dataset.info
    wx.navigateTo({
      url: '/pages/student/orderClass/index',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { 
          data: {
            ...info
          }
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      isRefreshing: true
    })
    this.getCoachList()
  },
})