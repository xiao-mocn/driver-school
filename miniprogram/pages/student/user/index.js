//获取应用实例
import { images } from "../../const/index"
Component({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    images,
    globalData: {}
  },
  lifetimes: {
    attached: function(options) {
      console.log('attached')
      const app = getApp()
      this.setData({
        userInfo: wx.getStorageSync('userInfo') || {},
        globalData: app.globalData
      })
    },
  },
  methods: {
    onLogin: function () {
      console.log('登录')
    },
  },
})