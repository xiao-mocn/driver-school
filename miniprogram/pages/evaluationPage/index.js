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
    },
    images,
    isRefreshing: false,
    orderList: [],
    evaluationInfo: {
      totalRating: 0,
      venueRating: 0,
      coachRating: 0
    },
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      searchForm: {
        name: '',
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
      studentId: this.data.userInfo._id || undefined,
      coachName: this.data.searchForm.name || undefined,
      status: 'complete'
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
  onEvaluate(e) {
    const index = e.currentTarget.dataset.index; // 获取要更新的元素索引
    const updatedOrderList = [...this.data.orderList]; // 创建数组的副本
    // 更新指定索引的元素
    updatedOrderList[index] = {
      ...updatedOrderList[index],
      totalRating: 0,
      venueRating: 0,
      coachRating: 0,
      isShowEvaluation: true,
      isEvaluationed: false,
      evaluationTime: getCurrentDate('YYYY-MM-dd hh:mm:ss')
    };
    // 更新数据
    this.setData({
      orderList: updatedOrderList
    });
  },
  onShowEvaluation(e) {
    const index = e.currentTarget.dataset.index; // 获取要更新的元素索引
    const updatedOrderList = [...this.data.orderList]; // 创建数组的副本
    updatedOrderList[index] = {
      ...updatedOrderList[index],
      isShowEvaluation: !updatedOrderList[index].isShowEvaluation,
    };
    this.setData({
      orderList: updatedOrderList
    });
  },
  rate(e) {
    const { field, starIndex, orderIndex } = e.currentTarget.dataset; // 获取字段名、星级索引和订单索引
    if (this.data.orderList[orderIndex].isEvaluationed) return
    const updatedOrderList = [...this.data.orderList];
    updatedOrderList[orderIndex][field] = starIndex + 1
    // 更新数据
    this.setData({
      orderList: updatedOrderList
    });
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
  evaluteSubmit(e) {
    const info = e.currentTarget.dataset.info
    console.log('info ===', info)
    wx.showLoading({
      title: '',
    });
    callCloudFunction('quickstartFunctions', {
      type: 'order',
      moduleType: 'update',
      data: {
        ...info,
        isEvaluationed: true,
        isShowEvaluation: false
      }
    }).then((res) => {
      wx.hideLoading()
      wx.showToast({
        title: '评价成功',
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
})