//获取应用实例
import { images } from "../../const/index"
import { defaultSendMessage } from '../../utils/index'
import callCloudFunction from '../../utils/cloudFunctionUtils'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    images,
    orderInfo: {},
    userInfo: {}
  },
  onLoad: async function(options) {
    const orderId = options.orderId
    console.log('orderId ===', options)
    if (orderId) {
      await this.initOrderInfo(orderId)
    }
    
  },
  async initOrderInfo(orderId) {
    return new Promise((resolve, reject) => {
      callCloudFunction('quickstartFunctions', {
        type: 'selectRecord',
        collectionName: 'orders',
        _id: orderId
      }).then((res) => {
        console.log('res ===', res)
        wx.setStorageSync('orderInfo', res)
        this.setData({
          orderInfo: res
        })
        resolve()
      }).catch((err) => {
        console.log('err ===', err)
        reject(err)
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    console.log('onShow')
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
      return
    }
    this.setData({
      userInfo,
      orderInfo: wx.getStorageSync('orderInfo')
    })
  },
  onUnload() {
    wx.removeStorage({
      key: 'orderInfo'
    })
  },
  handleCancel() {
    wx.navigateBack({
      delta: 1 // 返回到上级页面
    });
  },
  async handleButtonClick() {
    wx.showLoading({
      title: '正在提交',
      mask: true
    });
    this.callFunctionAdd()
    
  },
  async callFunctionAdd(outTradeNo) {
    // 随便一个教练信息存在即可将订单状态改为running
    callCloudFunction('quickstartFunctions', {
      type: 'order',
      moduleType: 'add',
      data: {
        ...this.data.orderInfo,
        payStatus: 'paid',
        outTradeNo,
      }
    }).then(async (resp) => {
      console.log('resp ====', resp)
      // 发生消息
      this.callPayment(resp)
    }).catch((err) => {
      console.log('err ====', err)
      wx.showToast({
        title: err || '订单生成失败,请重试',
      })
    })
  },
  callPayment(orderId) {
    callCloudFunction('wxpayFunctions', {
      type: 'wxpay_order',
      payNum: this.data.orderInfo.prices * 100
    }).then((resp) => {
      console.log('resp ====', resp)
      wx.requestPayment({
        ...resp,
        package: resp.packageVal,
        success: async (res) => {
          console.log('res ====', res)
          await this.updateOrder(resp, orderId)
          wx.hideLoading();
          wx.showToast({ title: '支付成功' });
          this.sendMessage(resp.outTradeNo)
          this.finallyCallBack()
        },
        fail: (res) => {
          console.log('fail', res)
          wx.hideLoading();
          wx.showToast({ title: '支付失败, 请重试', icon: 'none' });
          this.deleteOrder(orderId)
        }
      });
    }).catch(err => {
      console.log(err)
    })
  },
  async sendMessage(outTradeNo) {
    const date = `${this.data.orderInfo.orderTime} ${this.data.orderInfo.orderTimePeriod.split('-')[0]}`
    await defaultSendMessage({
      template_id: '9gYLIXnaZszuCzgDVZ8etmDoLQly1OFdXhja8zhwWHg',
      openId: this.data.userInfo.openId,
      orderId: this.data.orderInfo._id,
      data: {
        character_string5: {
          value: outTradeNo
        },
        date3: {
          value: date
        },
        thing15: {
          value: `训练科目: ${ this.data.orderInfo.trainTypeLabel }`
        },
        thing1: {
          value: `${ this.data.orderInfo.coachInfo.schoolName || '未指定' }`
        },
        thing4: {
          value: `该订单已支付成功，请及时查看`
        }
      }
    })
    if (this.data.orderInfo.coachId) {
      await defaultSendMessage({
        template_id: '9gYLIXnaZszuCzgDVZ8etmDoLQly1OFdXhja8zhwWHg',
        openId: this.data.orderInfo.coachInfo.openId,
        orderId: this.data.orderInfo._id,
        data: {
          character_string5: {
            value: outTradeNo
          },
          date3: {
            value: date
          },
          thing15: {
            value: `训练科目: ${ this.data.orderInfo.trainTypeLabel }`
          },
          thing1: {
            value: `${ this.data.orderInfo.coachInfo.schoolName || '未指定' }`
          },
          thing4: {
            value: `有新订单派送，请及时查看！`
          }
        }
      })
    }
  },
  async updateOrder(res, orderId) {
    // 订单状态更新
    callCloudFunction('quickstartFunctions', {
      type: 'defaultUpdate',
      _id: orderId,
      collectionName: 'orders',
      data: {
        outTradeNo: res.outTradeNo,
      }
    }).then((resp) => {
      console.log('resp ====', resp)
    })
  },
  deleteOrder(orderId) {
    callCloudFunction('quickstartFunctions', {
      type: 'order',
      moduleType: 'cancel',
      data: {
        _id: orderId,
        ...this.data.orderInfo,
        payStatus: 'cancel',
      }
    }).then((resp) => {
      console.log('resp ====', resp)
    }).catch((err) => {
      console.error('err ====', err)
    })
  },
  finallyCallBack() {
    setTimeout(() => {
      wx.navigateBack({
        delta: 2 // 返回到上级页面
      });
    }, 1000);
  }
})