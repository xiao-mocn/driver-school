import { images, companyInfo } from "../../const/index"
import callCloudFunction from "../../utils/cloudFunctionUtils"
Component({
  data: {
    carouselImages: [],
    iconArr:[
      { id: 1, iconName: '驾校信息', iconUrl: images.student.company, type: 'company', pageAddress: '/pages/gallery/index', dec: '驾校详情' },
      { id: 2, iconName: '预约课时', iconUrl: images.student.appointment, pageAddress: '/pages/student/orderClass/index', dec: '课时详情' },
      { id: 3, iconName: '返现活动', iconUrl: images.student.activity, pageAddress: '', dec: '更多优惠' }
    ],
    images,
    isRefreshing: false,
    announcementList: [],
    coachList: []
  },
  lifetimes: {
    attached: function(options) {
      this.initData()
    },
  },
  methods: {
    initData() {
      this.getHomeInfo()
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function (ww) {
      this.setData({
        isRefreshing: true
      })
      this.getHomeInfo()
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
    getHomeInfo() {
      wx.showLoading({
        title: '',
      });
      callCloudFunction('quickstartFunctions', {
        type: 'home',
        moduleType: 'student',
        limit: 5
      }).then(res => {
        console.log('res ====', res)
        this.setData({
          coachList: res.coachList || [],
          carouselImages: res.bannerList || [],
          announcementList: res.announcementList || [],
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
                des: item.content,
                id: item._id
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
                ...companyInfo
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
      console.log('coachInfo ====', coachInfo)
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