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
      this.getNewCoachInfo()
      this.getOrderList()
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      this.setData({
        isRefreshing: true
      })
      this.initData()
    },
    getNewCoachInfo() {
      const userInfo = wx.getStorageSync('userInfo')
      callCloudFunction('quickstartFunctions', {
        type: 'selectRecord',
        collectionName: 'coaches',
        _id: userInfo._id
      }).then((res) => {
        wx.setStorageSync('userInfo', res)
        const monthlyOrderInfo = res?.monthlyOrderInfo || {}
        const currentMonth = getCurrentDate('YYYY-MM').split('-').join('_')
        this.setData({
          userInfo: res,
          monthOrdNum: monthlyOrderInfo[currentMonth] || 0
        })
      }).catch((err) => {
        wx.showToast({
          title: '获取最新信息失败',
          icon: 'none'
        })
      })
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
          coachId: this.data.userInfo._id
        }
      }
      callCloudFunction('quickstartFunctions', {
        type: 'order',
        moduleType: 'queryList',
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
            wx.showLoading({
              title: '',
            });
            callCloudFunction('quickstartFunctions', {
              type: 'order',
              moduleType: 'update',
              data: {
                ...orderInfo,
                status: 'running',
                coachId: this.data.userInfo._id,
                coachName: this.data.userInfo.name,
                coachInfo: this.data.userInfo,
              }
            }).then((res) => {
              wx.hideLoading()
              wx.showToast({
                title: '接单成功',
                icon: 'success'
              })
              this.initData()
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
      const currentTime = new Date(getCurrentDate('YYYY/MM/DD hh:mm:ss')).getTime()
      const orderTimeFormat = `${orderInfo.orderTime.replace(/\-/g, '/')} ${orderInfo.orderTimePeriod.split('-')[1]}:00`
      const orderTime = new Date(orderTimeFormat).getTime()
      if (currentTime <= orderTime) {
        wx.showToast({
          title: '请等待超过预约时间',
          icon: 'none'
        })
        return
      }
      wx.showModal({
        title: '提示',
        content: '确定完成该订单吗？',
        success: (res) => {
          if (res.confirm) {
            callCloudFunction('quickstartFunctions', {
              type: 'order',
              moduleType: 'update',
              data: {
                ...orderInfo,
                status: 'complete'
              }
            }).then((res) => {
              wx.hideLoading()
              wx.showToast({
                title: '完成订单',
                icon: 'success'
              })
              this.initData()
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
    }
  }
})