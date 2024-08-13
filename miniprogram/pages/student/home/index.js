import { envId, images } from "../../const/index"
Component({
  data: {
    carouselImages: [],
    iconArr:[
      { id: 1, iconName: '公司信息', iconUrl: images.student.company, type: 'company', pageAddress: '/pages/gallery/index', dec: '公司详情' },
      { id: 2, iconName: '预约课时', iconUrl: images.student.appointment, pageAddress: '/pages/student/coachList/index', dec: '课时详情' },
      { id: 3, iconName: '返现活动', iconUrl: images.student.activity, pageAddress: '', dec: '更多优惠' }
    ],
    envId,
    images,
    isRefreshing: false,
    noticeArr: [{title: '欢迎来到通告信息', id: 1, des: '欢迎来到通告信息详情' }, {title: '标题2', id: 2, des: '标题2详情' }],
    coachList: []
  },
  lifetimes: {
    attached: function(options) {
      console.log('页面加载')
      this.getCoachList()
      this.getBanners()
    },
  },
  methods: {
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
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: envId,
        },
        data: {
          type: 'selectRecord',
          collectionName: 'coachs',
          limit: 5,
        }
      }).then(res => {
        const result = res.result
        this.setData({
          coachList: result.data,
          isRefreshing: false
        })
        wx.hideLoading();
      })
    },
    getBanners() {
      wx.showLoading({
        title: '',
      });
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: envId,
        },
        data: {
          type: 'selectRecord',
          collectionName: 'banners',
          limit: 3,
        }
      }).then(res => {
        this.setData({
          carouselImages: res.result.data,
          isRefreshing: false
        })
        wx.hideLoading();
      }).catch(err => {
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
                title: item.title,
                list: [{
                  des: item.des,
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
      const info = e.currentTarget.dataset.info
      wx.navigateTo({
        url: '/pages/student/orderClass/index',
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { 
            data: {
              ...info
            }
          })
        }
      })
    },
  },
})