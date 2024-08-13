import { images } from "../../const/index"
//获取应用实例
Component({
  /**
   * 页面的初始数据
   */
  data: {
    activeName: 'OrderHall',
    images,
    userInfo: {},
    isRefreshing: false
  },

  lifetimes: {
    attached: function(options) {
      console.log('页面加载')
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      this.getOrderList()
    },
  },
  methods: {
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function (ww) {
      this.setData({
        isRefreshing: true
      })
      this.getOrderList()
    },
    getOrderList() {
      this.setData({
        isRefreshing: false
      })
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
  }
})