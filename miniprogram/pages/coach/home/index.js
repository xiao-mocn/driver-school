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
      const userInfo = wx.getStorageSync('userInfo')
      const monthlyOrderInfo = userInfo?.monthlyOrderInfo || {}
      console.log('monthlyOrderInfo ==', monthlyOrderInfo)
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        monthOrdNum: monthlyOrderInfo[currentYear + '-' + currentMonth] || 0
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
        }
      }).then((res) => {
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
      console.log('orderHallList ==', this.data.orderHallList)
      console.log('pendingOrderList ==', this.data.pendingOrderList)
      this.setData({
        activeName
      })
    },
  }
})