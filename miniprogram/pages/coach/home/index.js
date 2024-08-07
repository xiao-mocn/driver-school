import { envId, images } from "../../const/index"
//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeName: 'OrderHall',
    envId,
    images
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
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
   * 切换Tabs
   */
  tabsChange: function (e) {
    const activeName = e.currentTarget.dataset.name
    this.setData({
      activeName
    })
  },
})