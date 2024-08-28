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
    rating: 0,
    evaluationInfo: {
      totalRating: 0,
      venueRating: 0,
      coachRating: 0
    }
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
      evaluationTime: getCurrentDate('yyyy-MM-dd hh:mm:ss'),
      evaluationInfo: {
        totalRating: 2,
        venueRating: 3,
        coachRating: 4
      }
    };
    // 更新数据
    this.setData({
      orderList: updatedOrderList
    });

  },
  rate(e) {
    const { field, starIndex, orderIndex } = e.currentTarget.dataset; // 获取字段名、星级索引和订单索引
    console.log('field ===', field)
    console.log('starIndex ===', starIndex)
    console.log('orderIndex ===', orderIndex)
    // 创建 orderList 的副本
    const updatedOrderList = [...this.data.orderList];

    // 更新指定订单的指定评分
    updatedOrderList[orderIndex].evaluationInfo[field] = starIndex + 1;

    // 更新数据
    this.setData({
      orderList: updatedOrderList
    });
    // 调试输出
    console.log('Updated orderList:', updatedOrderList);
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

    // callCloudFunction('quickstartFunctions', {
    // })
  }
})