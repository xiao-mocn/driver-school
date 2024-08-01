import { envId } from "../../../envList"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    envId: '',
    coachList: [],
    isRefreshing: false,
    searchQuery: ''
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
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: envId,
      },
      data: {
        type: 'selectRecord',
        collectionName: 'coachs',
        data: data
      }
    }).then(res => {
      console.log('res ===', res)
      const result = res.result
      this.setData({
        coachList: result.data,
        isRefreshing: false
      })
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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