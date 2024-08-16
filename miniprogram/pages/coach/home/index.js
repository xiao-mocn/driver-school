import { images } from "../../const/index"
import callCloudFunction from '../../utils/cloudFunctionUtils'
//获取应用实例
Component({
  /**
   * 页面的初始数据
   */
  data: {
    activeName: 'OrderHall',
    images,
    userInfo: {},
    totalList: [],
    orderHallList: [],
    pendingOrderList: [],
    isRefreshing: false
  },

  lifetimes: {
    attached: function(options) {
      console.log('页面加载')
      this.initData()
    },
  },
  methods: {
    initData() {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      this.getOrderList()
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.setData({
        isRefreshing: true
      })
      this.getOrderList()
    },
    getOrderList() {
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
      callCloudFunction('quickstartFunctions', {
        type: 'selectRecord',
        collectionName: 'orders',
        data: {
          ...this.data.formData
        }
      }).then((res) => {
        console.log('res ===', res)
        this.setData({
          totalList: res,
          orderHallList: res.filter(item => item.status === 'created'),
          pendingOrderList: res.filter(item => item.status === 'running'),
          isRefreshing: false
        })
        wx.hideLoading()
      }).catch((err) => {
        console.log(err)
        wx.hideLoading()
        this.setData({
          isRefreshing: false
        })
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