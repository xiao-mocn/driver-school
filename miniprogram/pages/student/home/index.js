Page({

  data: {
    carouselImages: [
      {
        id: 1,
        url: 'https://img0.baidu.com/it/u=1727517992,2544439649&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1721322000&t=09a9d87680a4bbf9a796ca877270f6ff'
      },
      {
        id: 2,
        url: 'https://img0.baidu.com/it/u=1273255728,1049971803&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1720544400&t=32176a77646a520dab73eca1a5124dcf'
      }
    ],
    noticeArr: [{title: '欢迎来到通告信息', id: 1}, {title: '手动滑稽说的就是', id: 2}],
    iconArr:[
      { id: 1, iconName: '公司信息', iconUrl: '../../../images/student/company.png', pageAddress: '/pages/sign/sign', dec: '公司详情' },
      { id: 2, iconName: '预约课时', iconUrl: '../../../images/student/appointment.png', pageAddress: '', dec: '课时详情' },
      { id: 3, iconName: '返现活动', iconUrl: '../../../images/student/activity.png', pageAddress: '/pages/sign/sign', dec: '更多优惠' }
    ],
    // tabs:[
    //   {
    //     id: 1,
    //     type: 'car',
    //     title: '车型',
    //     isActive: true,
    //   },
    //   {
    //     id: 2,
    //     type: 'coach',
    //     title: '教练',
    //     isActive: false
    //   },
    //   {
    //     id: 3,
    //     type: 'place',
    //     title: '场地',
    //     isActive: false
    //   }
    // ],
    // listType: 'caoch',
    // carTypes: [
    //   { id: 1, name: 'A1', price: '100元/次', describe: '一对多模式训练', statusText: '立即报名' },
    //   { id: 2, name: 'B1', price: '100元/次', describe: '一对多模式训练', statusText: '立即报名' },
    //   { id: 3, name: 'C1', price: '100元/次', describe: '一对多模式训练', statusText: '立即报名' },
    //   { id: 4, name: 'A2', price: '100元/次', describe: '一对多模式训练', statusText: '立即报名' },
    //   { id: 5, name: 'B1', price: '100元/次', describe: '一对多模式训练', statusText: '立即报名' },
    // ],
    coachList: [
      { id: 1, name: '张教练', avatar: '../../../images/student/appointment.png', starscore: 5, studentCount: 100, driving_age: 4 },
      { id: 2, name: '张教练', avatar: '../../../images/student/appointment.png', starscore: 5, studentCount: 100, driving_age: 4  },
      { id: 3, name: '张教练', avatar: '../../../images/student/appointment.png', starscore: 5, studentCount: 100, driving_age: 4  }
    ],
    // venueList: [
    //   { id: 1, name: '北京校区', address: '北京市东城区东直门街道', distance: '10公里', addressUrl: '../../images/icons/user-active.png' },
    //   { id: 2, name: '北京校区', address: '北京市东城区东直门街道', distance: '10公里', addressUrl: '../../images/icons/user-active.png'  },
    //   { id: 3, name: '北京校区', address: '北京市东城区东直门街道', distance: '10公里', addressUrl: '../../images/icons/user-active.png'  },
    //   { id: 4, name: '北京校区', address: '北京市东城区东直门街道', distance: '10公里', addressUrl: '../../images/icons/user-active.png'  },
    //   { id: 5, name: '北京校区', address: '北京市东城区东直门街道', distance: '10公里', addressUrl: '../../images/icons/user-active.png'  },
    // ]
  },

  onLoad: function(options) {
  },
  onReady: function() {
  },

  onShow: function() {
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
  }
})