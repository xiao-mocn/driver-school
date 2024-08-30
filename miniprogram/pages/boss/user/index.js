//获取应用实例
import { images } from "../../const/index"
Component({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    images
  },
  lifetimes: {
    attached: function(options) {
      this.initData()
    },
  },
  methods: {
    initData() {
      this.setData({
        userInfo: wx.getStorageSync('userInfo') || {},
      })
    },
    onLogin: function () {
      wx.removeStorage({
        key: 'userInfo'
      })
      wx.navigateTo({
        url: '/pages/login/index',
      })
    },
    onSetting() {
      wx.navigateTo({
        url: '/pages/personalInformation/index',
      })
    }
  },
})