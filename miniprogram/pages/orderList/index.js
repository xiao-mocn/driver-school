import { getCurrentDate } from "../utils/index"
import callCloudFunction from "../utils/cloudFunctionUtils";
import { images } from "../const/index";

//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    searchForm: {
      name: '',
      orderTime: ''
    },
    images,
    isRefreshing: false,
    orderList: []
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      searchForm: {
        name: '',
        orderTime: getCurrentDate('YYYY-MM-DD')
      }
    })
    this.initData()
  },
  bindDateChange(e) {
    const fieldName = e.currentTarget.dataset.name;
    this.setData({
      ['searchForm.' + fieldName]: e.detail.value
    });
    this.initData()
  },
  onConfirm(e) {
    const value = e.detail.value
    this.setData({
      'searchForm.name': value
    })
    this.initData()
  },
  initData() {
    const whereCondition = {} // 初始化筛选条件
    if (this.data.userInfo.registerType === 'student') {
      whereCondition.studentId = this.data.userInfo._id
      whereCondition.orderTime = this.data.searchForm.orderTime
      whereCondition.coachName = this.data.searchForm.name || undefined
    } else {
      whereCondition.coachId = this.data.userInfo._id
      whereCondition.orderTime = this.data.searchForm.orderTime
      whereCondition.studentName = this.data.searchForm.name || undefined
    }
    callCloudFunction('quickstartFunctions', {
      type: 'defaultQueryList',
      collectionName: 'orders',
      data: {
        ...whereCondition
      }
    }).then((res) => {
      console.log('res ===', res)
      this.setData({
        orderList: res,
        isRefreshing: false
      })
    }).catch((err) => {
      console.log('err ===', err)
    })
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
  handleDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.setStorageSync('orderInfo', item)
    wx.navigateTo({
      url: '/pages/orderList/detail/index'
    })
  },
  handleCancel(e) {
    const item = e.currentTarget.dataset.item
    console.log('item ===', item)
    wx.showModal({
      title: '提示',
      content: '确定取消该订单吗？',
      success: (res) => {
        // 退款操作
        callCloudFunction('wxpayFunctions', {
          type: 'wxpay_refund',
          data: {
            outTradeNo: item.outTradeNo,
            refund: 1, // 退款金额
            total: 1, // 原订单金额,
            currency: 'CNY',
          }
        })
        // 订单状态更新
        // callCloudFunction('quickstartFunctions', {
        //   type: 'order',
        //   moduleType: 'cancel',
        //   data: {
        //     ...item,
        //     payStatus: 'cancel',
        //   }
        // }).then((resp) => {
        //   console.log('resp ====', resp)
        //   this.initData()
        // }).catch((err) => {
        //   wx.showToast({
        //     title: err || '取消失败,请重试',
        //   })
        // })
      }
    })
  }
})