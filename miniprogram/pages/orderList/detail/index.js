//获取应用实例
import { images } from "../../const/index"
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
    this.setData({
      userInfo,
      orderInfo: wx.getStorageSync('orderInfo')
    })
  },
  handleCancel() {
    wx.navigateBack({
      delta: 1 // 返回到上级页面
    });
  },
  handleButtonClick() {
    wx.showLoading({
      title: '正在提交',
      mask: true
    });
    this.callFunctionAdd()
  },
  callFunctionAdd() {
    // 随便一个教练信息存在即可将订单状态改为running
    callCloudFunction('quickstartFunctions', {
      type: 'order',
      moduleType: 'add',
      data: {
        ...this.data.orderInfo,
      }
    }).then((resp) => {
      console.log('resp ====', resp)
      this.callPayment(resp)
    }).catch((err) => {
      wx.showToast({
        title: err || '提交失败,请重试',
      })
    })
    
  },
  callPayment(order_id) {
    callCloudFunction('wxpayFunctions', {
      type: 'wxpay_order',
      payNum: 1,
      order_id: order_id
    }).then((resp) => {
      console.log('resp ====', resp)
      wx.requestPayment({
        ...resp,
        package: resp.packageVal,
        success: (res) => {
          console.log('success', res)
          wx.hideLoading();
          wx.showToast({ title: '支付成功' });
          callCloudFunction('quickstartFunctions', {
            type: 'defaultUpdate',
            collectionName: 'orders',
            _id: order_id,
            data: {
              payStatus: 'paid'
            }
          })
          this.finallyCallBack()
        },
        fail: (res) => {
          console.log('fail', res)
          wx.hideLoading();
          wx.showToast({ title: '支付失败', icon: 'none' });
          this.finallyCallBack()
        }
      });
    }).catch(err => {
      console.log(err)
    })
  },
  finallyCallBack() {
    wx.removeStorage({
      key: 'orderInfo'
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 2 // 返回到上级页面
      });
    }, 1000);
  }
})