import { images } from "../../const/index"

//获取应用实例
Component({
  /**
   * 页面的初始数据
   */
  data: {
    admissionsCenterArr: [
      { id: 1, name: '学员报名', icon: images.boss.add_students, path: '/pages/boss/students_manage/index'},
      { id: 2, name: '活动管理', icon: images.boss.active_manage },
      { id: 3, name: '招生素材', icon: images.boss.material },
      { id: 4, name: '公告管理', icon: images.boss.announcement, path: '/pages/boss/announcements_manage/index' },
    ],
    applicationArr: [
      { id: 1, name: '团队管理', icon: images.boss.team, path: '/pages/boss/coaches_manage/index' },
      { id: 2, name: '车辆管理', icon: images.boss.car, path: '/pages/boss/cars_manage/index' },
      { id: 3, name: '学员管理', icon: images.boss.add_students, path: '/pages/boss/students_manage/index' },
      { id: 4, name: '学员统计', icon: images.boss.student_total },
      { id: 5, name: '团队统计', icon: images.boss.team_total },
      { id: 6, name: '收入统计', icon: images.boss.income_total },
      { id: 7, name: '活动统计', icon: images.boss.active_total },
      { id: 8, name: '全局总览', icon: images.boss.total },
    ],
    images
  },
  lifetimes: {
    attached: function(options) {
      this.initData()
    },
  },
  methods: {
    initData() {
      const userInfo = wx.getStorageSync('userInfo')
      if (!userInfo) {
        wx.redirectTo({
          url: '/pages/login/index',
        })
        return
      }
    }
  },
})