import { images } from "../../const/index"
import callCloudFunction from "../../utils/cloudFunctionUtils";

//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isRefreshing: false,
    searchQuery: '',
    images,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      isRefreshing: true
    })
    this.getList()
  },
  onConfirm(e) {
    console.log('e ===', e)
    const value = e.detail.value
    this.setData({
      searchQuery: value
    })
    this.getList()
  },
  onInput(e) {
  },

  getList() {
    wx.showLoading({
      title: '',
    });
    const data = {}
    if (this.data.searchQuery) {
      data.name = this.data.searchQuery
    }
    callCloudFunction('quickstartFunctions', {
      type: 'selectRecord',
      collectionName: 'coaches',
      data: data
    }).then(res => {
      this.setData({
        list: res,
        isRefreshing: false
      })
      wx.hideLoading();
    }).catch(err => {
      console.log('err ===', err)
      wx.hideLoading();
    })
  },
  handelAdd() {
    wx.navigateTo({
      url: `/pages/boss/coaches_manage/edit/index?type=add`,
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { 
          data: {
            name: '莫荣包',
            idCard: '452724199605032538',
            birthday: '2024-01-01',
            gender: 'man',
            phone: '15051836908',
            school: '上海驾校',
            classType: 'beginner',
            carType: 'C1',
            starscore: 5,
            studentCount: 0,
            todayOrdNum: 0,
            monthOdrNum: 0,
            incomeNum: 0,
            withdrawableIncome: 0
          }
        })
      }
    })
  },
  handelEdit(e) {
    const row = e.currentTarget.dataset.row;
    console.log('row ===', row);
    wx.navigateTo({
      url: `/pages/boss/coaches_manage/edit/index?type=edit`,
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: row })
      }
    })
  },
  handelDelete(e) {
    const row = e.currentTarget.dataset.row;
    const _this = this
    wx.showModal({
      title: '提示',
      content: '是否要删除该成员',
      success (res) {
        if (res.confirm) {
          _this.callFunctionDelete(row)
        } else if (res.cancel) {
          return
        }
      }
    })
  },
  callFunctionDelete(row) {
    callCloudFunction('quickstartFunctions', {
      type: 'deleteRecord',
      collectionName: 'coaches',
      _id: row._id
    }).then((res) => {
      console.log('res ===', res)
      wx.showToast({
        title: '删除成功',
      })
      this.getList()
    }).catch((err) => {
      console.log('err ===', err)
      wx.showToast({
        title: '删除失败',
      })
    })
  }
})