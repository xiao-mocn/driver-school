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
    const whereCondition = {
      studentId: this.data.userInfo._id,
      coachName: this.data.searchForm.name
    } // 初始化筛选条件
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
  onDelete(e) {
    wx.showModal({
      title: '提示',
      content: '确定删除该订单吗(不可恢复)?',
      success: (res) => {
        callCloudFunction('quickstartFunctions', {
          type: 'deleteRecord',
          collectionName: 'orders',
          _id: e.currentTarget.dataset.id
        }).then((res) => {
          wx.showToast({
            title: '删除成功'
          })
          this.initData()
        }).catch((err) => {
          console.log('err ===', err)
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
    this.initData()
  },
})