//获取应用实例
import { images } from "../../const/index"
import { getCurrentDate } from '../../utils/index'
import callCloudFunction from '../../utils/cloudFunctionUtils'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    images,
    coachInfo: {},
    selectedDates: [],
    prices: 30.00,
    selectedDate: '',
    selectedTimePeriod: '',
    dateOptions:[],
    timePeriods: [
      {name: '上午', selected: false, isFree: true, period: '07:00-8:00'},
      {name: '上午', selected: false, isFree: true, period: '8:30-9:30'},
      {name: '上午', selected: false, isFree: true, period: '10:00-11:00'},
      {name: '上午', selected: false, isFree: true, period: '11:30-12:30'},
      {name: '下午', selected: false, isFree: true, period: '13:00-14:00'},
      {name: '下午', selected: false, isFree: true, period: '14:30-15:30'},
      {name: '下午', selected: false, isFree: true, period: '16:00-17:00'},
      {name: '下午', selected: false, isFree: true, period: '17:30-18:30'}
    ],
    trainTypeLabel: '科目二',
    trainType: 'subject2',
    trainTypes: [
      { label: '自由练习', value: 'free' },
      { label: '科目二', value: 'subject2' },
      { label: '科目三', value: 'subject3' }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
      return
    }
    const dates = this.getCurrentDate()
    this.setData({
      dateOptions: dates
    })
    this.getCoachInfo()
  },
  getCoachInfo: function () {
    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.on('acceptDataFromOpenerPage', (data) => {
        this.setData({
          coachInfo: data.data,
          selectedDates: data.data.selectedDates || []
        })
        this.setTimePeriodStatus()
      });
    }
  },
  onPickerChange(e) {
    console.log(e.detail.value)
    const value = this.data.trainTypes[e.detail.value].value
    const label = this.data.trainTypes[e.detail.value].label
    this.setData({
      trainType:  value,
      trainTypeLabel:  label
    });
  },
  getCurrentDate() {
    let dates = []; // 用于存储日期和星期的数组
    const currentDate = new Date(); // 获取当前日期
    const weekdays = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"] // 星期数组
    for (let i = 0; i < 7; i++) {
      let futureDate = new Date(currentDate); // 创建一个新的日期对象，以免修改原始日期
      futureDate.setDate(currentDate.getDate() + i); // 设置未来的日期
      let dayOfWeek = weekdays[futureDate.getDay()]; // 获取星期几
      const year = futureDate.getFullYear()
      let month = futureDate.getMonth() + 1
      if (month < 10) {
        month = `0${month}`
      }
      let date = futureDate.getDate()
      if (date < 10) {
        date = `0${date}`
      }
      let formattedDate = `${month}-${date}`; // 格式化日期
      if (i === 0) {
        this.setData({
          selectedDate: `${year}-${formattedDate}`
        })
      }
      let selected = i === 0 ? true : false;
      dates.push({  // 将格式化后的日期和星期信息添加到数组中
        date: formattedDate,
        weekday: dayOfWeek,
        year,
        selected: selected,
      })
    }
    return dates; // 返回包含未来5天日期和星期的数组
  },
  onDateSelect(e) {
    const item = e.currentTarget.dataset.date
    const fullDate = `${item.year}-${item.date}`
    this.setData({
      selectedDate: fullDate,
      selectedTimePeriod: ''
    })
    this.setData({
      dateOptions: this.data.dateOptions.map((i) => {
        if (i.date === item.date) {
          return {
            ...i,
            selected: true
          }
        } else {
          return {
            ...i,
            selected: false
          }
        }
      })
    })
    this.setTimePeriodStatus()
  },
  setTimePeriodStatus() {
    const selectedTimePeriods = this.data.selectedDates.filter((i) => {
      return `${i.year}-${i.date}` === this.data.selectedDate
    })[0]?.timePeriods
    this.setData({
      timePeriods: this.data.timePeriods.map((i) => {
        return {
          ...i,
          isFree: selectedTimePeriods?.includes(i.period) ? false : true,
          selected: i.period === this.data.selectedTimePeriod ? true : false
        }
      })
    })
  },
  onPeriodSelect(e) {
    const period = e.currentTarget.dataset.period
    console.log(period)
    for(let i = 0; i < this.data.timePeriods.length; i++) {
      const item = this.data.timePeriods[i]
      if (period === item.period) {
        if (!item.isFree) {
          wx.showToast({
            title: '该时间段已被预约',
            icon: 'none'
          })
          return
        }
        item.selected = true
      } else {
        item.selected = false
      }
    }
    this.setData({
      timePeriods: this.data.timePeriods,
      selectedTimePeriod: period
    })
  },
  handleCancel() {
    wx.navigateBack({
      delta: 1  // 返回到上级页面
    });
  },
  handleButtonClick() {
    console.log(JSON.parse(JSON.stringify(this.data)))
    if (!this.data.selectedTimePeriod) {
      wx.showToast({
        title: '请选择时间段',
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定要预约吗？',
      success: (res) => {
        if (res.confirm) {
          // let status = this.data.coachInfo._id ? 'running' : 'created'
          // wx.setStorageSync('orderInfo', {
          //   coachId: this.data.coachInfo._id,
          //   coachName: this.data.coachInfo.name,
          //   coachInfo: this.data.coachInfo,
          //   studentId: wx.getStorageSync('userInfo')._id,
          //   studentName: wx.getStorageSync('userInfo').name,
          //   studentInfo: wx.getStorageSync('userInfo'),
          //   orderTime: this.data.selectedDate,
          //   orderTimePeriod: this.data.selectedTimePeriod,
          //   status,
          //   payStatus: 'unpaid',
          //   createdAt: getCurrentDate('YYYY-MM-DD hh:mm:ss'),
          //   trainTypeLabel: this.data.trainTypeLabel,
          //   trainType: this.data.trainType,
          //   prices: this.data.prices,
          // })
          // wx.navigateTo({
          //   url: '/pages/orderList/detail/index'
          // })
          wx.cloud.callFunction({
            name: 'cloudbase_module',
            data: {
              name: 'wx_message_send_message',
              data: {
                template_id: "9gYLIXnaZszuCzgDVZ8etmDoLQly1OFdXhja8zhwWHg", // 所需下发的订阅模板id
                page: "pages/orderList/detail/index", //点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转
                touser: "obvwd7SHts4m3BmeK57ovqgRkpUA", //接收者（用户）的 openid
                data: {
                  character_string5: { value: '458dc8cc66e1b86000b910a442e66643' }, // 确保字段名称和类型与模板一致
                  date3: { value: '2024-09-15 14:30' }, // 根据实际情况填写
                  thing1: { value: '北京市朝阳区建国路88号' },
                  thing15: { value: '两件咖啡' },
                  thing4: { value: '已支付' }
                }, // 模板内容，格式形如 { "key1": { "value": any }, "key2": { "value": any } }的object
                miniprogram_state:"developer", //跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
                lang:"zh_CN" //进入小程序查看”的语言类型，支持zh_CN(简体中文)、en_US(英文)、zh_HK(繁体中文)、zh_TW(繁体中文)，默认为zh_CN
              },
            },
            success: (res) => {
              console.log('综合结果', res.result.result);
              console.log('错误码', res.result.errcode);
              console.log('错误信息', res.result.errmsg);
            },
            fail: (err) => {
              console.log('err', err);
            }
          });
        }
      }
    })
  }
})