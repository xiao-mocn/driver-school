//获取应用实例
import { envId } from "../../const/index"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    envId,
    coachInfo: {
      name: '',
      avatar: '',
      starscore: '',
      studentCount: '',
      carType: '',
      school: ''
    },
    selectedDates: [],
    prices: 30.00,
    selectedDate: '',
    selectedTimePeriod: '',
    dateOptions:[],
    timePeriods: [
      {name: '上午', selected: false, isFree: true, period: '07:00-9:00'},
      {name: '上午', selected: false, isFree: true, period: '9:30-11:30'},
      {name: '下午', selected: false, isFree: true, period: '13:30-15:30'},
      {name: '下午', selected: false, isFree: true, period: '16:00-18:00'}
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getCoachInfo()
  },
  getCoachInfo: function () {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      const dates = this.getCurrentDate()
      this.setData({
        coachInfo: data.data,
        dateOptions: dates,
        selectedDates: data.data.selectedDates || []
      })
      this.setTimePeriodStatus()
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  getCurrentDate() {
    let dates = []; // 用于存储日期和星期的数组
    const currentDate = new Date(); // 获取当前日期
    const weekdays = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"] // 星期数组
    for (let i = 0; i < 5; i++) {
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
          selectedDate: `${dayOfWeek}:${year}:${formattedDate}`
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
    const fullDate = `${item.weekday}:${item.year}:${item.date}`
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
      return `${i.weekday}:${i.year}:${i.date}` === this.data.selectedDate
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
          this.callFunctionUpdate()
        }
      }
    })
  },
  callFunctionUpdate() {
    wx.showLoading({
      title: '正在提交',
    });
    const dateInfoArr = this.data.selectedDate.split(':')
    if (this.data.selectedDates.length > 0) {
      this.data.selectedDates.forEach((i) => {
        if (`${i.weekday}:${i.year}:${i.date}` === this.data.selectedDate) {
          i.timePeriods.push(this.data.selectedTimePeriod)
        }
      })
    } else {
      this.data.selectedDates.push({
        year: dateInfoArr[1],
        date: dateInfoArr[2],
        weekday: dateInfoArr[0],
        timePeriods: [this.data.selectedTimePeriod]
      })
    }
    // 新增order信息
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: envId,
      },
      data: {
        type: 'addRecord',
        collectionName: 'orders',
        data: {
          coachInfo: {
            ...this.data.coachInfo,
            studentCount: this.data.coachInfo.studentCount ? this.data.coachInfo.studentCount + 1 : 1,
          },
          selectedDates: this.data.selectedDates,
          status: 'created',
        }
      }
    }).then((resp) => {
      const { success, message } = resp.result
      wx.hideLoading();
      if (!success) {
        wx.showToast({
          title: message,
          icon: 'error', // 提示图标，可选值：'success', 'loading', 'none'
          duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
          mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
        })
        return
      }
      wx.showToast({
        title: '提交成功',
        icon: 'success', // 提示图标，可选值：'success', 'loading', 'none'
        duration: 1000, // 提示的持续时间，单位为毫秒，默认为 1500
        mask: true // 是否显示透明蒙层，防止触摸穿透，默认为 false
      })
      // 更新教练信息
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: envId,
        },
        data: {
          type: 'updateRecord',
          collectionName: 'coachs',
          data: {
            ...this.data.coachInfo,
            studentCount: this.data.coachInfo.studentCount ? this.data.coachInfo.studentCount + 1 : 1,
            selectedDates: this.data.selectedDates
          }
        }
      })
      wx.navigateBack({
        delta: 1  // 返回到上级页面
      });
    }).catch((err) => {
      wx.showToast({
        title: '提交失败',
      })
    })
    console.log(this.data.selectedDates)
  }
})