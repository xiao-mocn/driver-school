import { images } from "../../const/index"
import callCloudFunction from '../../utils/cloudFunctionUtils'
import { getCurrentDate } from '../../utils/index'
//获取应用实例
Component({
  /**
   * 页面的初始数据
   */
  data: {
    activeName: 'OrderHall',
    images,
    userInfo: {},
    orderList: [],
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
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        monthOrdNum: monthlyOrderInfo[getCurrentDate('YYYY-MM')] || 0
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
      let params = {}
      if (this.data.activeName === 'OrderHall') {
        params = {
          status: 'created',
          orderTime: getCurrentDate('YYYY-MM-DD')
        }
      } else {
        params = {
          status: 'running',
          orderTime: getCurrentDate('YYYY-MM-DD'),
          coachId: this.data.userInfo._id
        }
      }
      callCloudFunction('quickstartFunctions', {
        type: 'orderList',
        collectionName: 'orders',
        ...params
      }).then((res) => {
        console.log('res ==', res)
        this.setData({
          orderList: res,
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
      this.getOrderList()
    },
    onTap(e) {
      const { info } = e.currentTarget.dataset
      if (this.data.activeName === 'OrderHall') {
        this.acceptOrder(info)
      } else {
        this.finishOrder(info)
      }
    },
    acceptOrder(orderInfo) {
      console.log('acceptOrder ==', orderInfo)
      if (this.data.userInfo.carTypes.indexOf(orderInfo.studentInfo.carType) === -1) {
        wx.showToast({
          title: '预约车型不符，请重新预约',
          icon: 'none'
        })
        return
      }
      wx.showModal({
        title: '提示',
        content: '确定接受该订单吗？',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '加载中',
              icon: 'loading'
            })
            callCloudFunction('quickstartFunctions', {
              type: 'updateOrder',
              collectionName: 'orders',
              data: {
                ...orderInfo,
                status: 'running',
                coachId: this.data.userInfo._id
              }
            }).then((res) => {
              wx.hideLoading()
              wx.showToast({
                title: '操作成功',
                icon: 'success'
              })
              this.getOrderList()
            }).catch((err) => {
              wx.hideLoading()
              wx.showToast({
                title: err || '出现错误，请稍后重试',
                icon: 'none'
              })
            })
          }
        }
      })

    },
    finishOrder(orderInfo) {
      console.log('finishOrder ==', orderInfo)
    }
  }
})