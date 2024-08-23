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
      data.title = this.data.searchQuery
    }
    callCloudFunction('quickstartFunctions', {
      type: 'defaultQueryList',
      collectionName: 'announcements',
      data: {
        ...data
      }
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
      url: `/pages/boss/announcements_manage/edit/index`,
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { 
          data: {
            title: '',
            conntent: '',
            type: 'add'
          }
        })
      }
    })
  },
  handelEdit(e) {
    const row = e.currentTarget.dataset.row;
    wx.navigateTo({
      url: `/pages/boss/announcements_manage/edit/index`,
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: {
            ...row,
            type: 'edit'
          }
        })
      }
    })
  },
  handelDelete(e) {
    const row = e.currentTarget.dataset.row;
    const _this = this
    wx.showModal({
      title: '提示',
      content: '是否要删除该公告',
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
      collectionName: 'announcements',
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