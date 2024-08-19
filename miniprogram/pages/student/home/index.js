import { images } from "../../const/index"
import callCloudFunction from "../../utils/cloudFunctionUtils"
Component({
  data: {
    carouselImages: [],
    iconArr:[
      { id: 1, iconName: '公司信息', iconUrl: images.student.company, type: 'company', pageAddress: '/pages/gallery/index', dec: '公司详情' },
      { id: 2, iconName: '预约课时', iconUrl: images.student.appointment, pageAddress: '/pages/student/orderClass/index', dec: '课时详情' },
      { id: 3, iconName: '返现活动', iconUrl: images.student.activity, pageAddress: '', dec: '更多优惠' }
    ],
    images,
    isRefreshing: false,
    noticeArr: [{title: '欢迎来到通告信息', id: 1, des: '欢迎来到通告信息详情' }, {title: '标题2', id: 2, des: '标题2详情' }],
    coachList: []
  },
  lifetimes: {
    attached: function(options) {
      this.initData()
    },
  },
  methods: {
    initData() {
      this.getCoachList()
      this.getBanners()
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function (ww) {
      this.setData({
        isRefreshing: true
      })
      this.getCoachList()
      this.getBanners()
    },
    handleTabsItemChange: function (e) {
      const changeIndex = e.detail.index
      let { tabs, tabsType } = this.data
      tabs.forEach((item, index) => {
        if (index === changeIndex) {
          item.isActive = true
          tabsType = item.type
        } else {
          item.isActive = false
        }
      })
      this.setData({ tabs, tabsType })
    },
    getCoachList() {
      wx.showLoading({
        title: '',
      });
      callCloudFunction('quickstartFunctions', {
        type: 'selectRecord',
        collectionName: 'coaches',
        limit: 5,
      }).then(res => {
        console.log('res ====', res)
        this.setData({
          coachList: res,
          isRefreshing: false
        })
        wx.hideLoading();
      })
    },
    getBanners() {
      wx.showLoading({
        title: '',
      });
      callCloudFunction('quickstartFunctions', {
        type: 'selectRecord',
        collectionName: 'banners',
        limit: 3,
      }).then(res => {
        this.setData({
          carouselImages: res,
          isRefreshing: false
        })
        wx.hideLoading();
      })
    },
    handleNotice(e) {
      const item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/gallery/index`,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { 
            data: {
              title: item.title,
              list: [{
                des: item.des,
                id: item.id
              }]
            }
          })
        }
      })
    },
    handleIcon(e) {
      const item = e.currentTarget.dataset.item
      if (item.type === 'company') {
        wx.navigateTo({
          url: item.pageAddress,
          success: function (res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', { 
              data: {
                title: '公司介绍',
                list: [{
                  des: `欢迎来到我们的驾校，我们是一家致力于为学员提供专业、高效和安全的驾驶培训服务的公司。我们拥有一支经验丰富、技术精湛的教练团队，他们采用先进的教学方法，结合实战经验，让学员在最短的时间内掌握驾驶技能。我们注重理论与实践相结合的教学模式，让学员在轻松愉快的氛围中学习驾驶。除了驾驶技能培训外，我们还提供心理辅导和安全意识教育，帮助学员树立正确的驾驶观念和态度。选择我们，你将能够快速拿到驾照，并成为一名合格的驾驶员。欢迎加入我们，让我们陪你走过难忘的驾考之旅！`,
                  id: item.id
                }]
              }
            })
          }
        })
      } else {
        wx.navigateTo({
          url: item.pageAddress
        })
      }
    },
    handleAppointment (e) {
      const coachInfo = e.currentTarget.dataset.info
      const userInfo = wx.getStorageSync('userInfo')
      if (coachInfo.carTypes.indexOf(userInfo.carType) === -1) {
        wx.showToast({
          title: '预约车型不符，请重新预约',
          icon: 'none'
        })
        return
      }
      wx.navigateTo({
        url: '/pages/student/orderClass/index',
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { 
            data: {
              ...coachInfo
            }
          })
        }
      })
    },
  },
})