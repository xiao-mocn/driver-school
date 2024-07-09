Page({
  properties: {
  },
  data: {
    carTypes: [
      { id: 1, name: 'A1', price: '100元/次', describe: '一对多模式训练', statusText: '立即报名' },
      { id: 2, name: 'B1', price: '100元/次', describe: '一对多模式训练', statusText: '立即报名' },
      { id: 3, name: 'C1', price: '100元/次', describe: '一对多模式训练', statusText: '立即报名' },
      { id: 4, name: 'A2', price: '100元/次', describe: '一对多模式训练', statusText: '立即报名' },
      { id: 5, name: 'B1', price: '100元/次', describe: '一对多模式训练', statusText: '立即报名' },
    ],
    coachList: [
      { id: 1, name: '张教练', avatar: '../../images/icons/user-active.png', starscore: 5, studentCount: 100, driving_age: 4 },
      { id: 2, name: '张教练', avatar: '../../images/icons/user-active.png', starscore: 5, studentCount: 100, driving_age: 4  },
      { id: 3, name: '张教练', avatar: '../../images/icons/user-active.png', starscore: 5, studentCount: 100, driving_age: 4  }
    ],
    venueList: [
      { id: 1, name: '北京校区', address: '北京市东城区东直门街道', distance: '10公里', addressUrl: '../../images/icons/user-active.png' },
      { id: 2, name: '北京校区', address: '北京市东城区东直门街道', distance: '10公里', addressUrl: '../../images/icons/user-active.png'  },
      { id: 3, name: '北京校区', address: '北京市东城区东直门街道', distance: '10公里', addressUrl: '../../images/icons/user-active.png'  },
      { id: 4, name: '北京校区', address: '北京市东城区东直门街道', distance: '10公里', addressUrl: '../../images/icons/user-active.png'  },
      { id: 5, name: '北京校区', address: '北京市东城区东直门街道', distance: '10公里', addressUrl: '../../images/icons/user-active.png'  },
    ],
    type: ''
  },
  onLoad: function(options) {
    console.log('options ===', options)
    const { type } = options
    this.setData({
      type
    })
  },
  onReady: function() {
  },
  onShow: function() {
  }
})