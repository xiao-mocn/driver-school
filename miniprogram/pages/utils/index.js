//首次点击允许获取用户信息并且授权
export const getUserProfile = function () {
  return new Promise((resolve, reject) => {
    const wxInfo = wx.getStorageSync('wxInfo')
    if (wxInfo) {
      resolve(wxInfo)
      return
    }
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途
      success: (res) => {
        // 这里可以进行保存操作或其他逻辑
        wx.setStorageSync('wxInfo', res.userInfo)
        resolve(res.userInfo)
      },
      fail: () => {
        wx.showToast({
          title: '请允许获取用户信息',
          icon: 'none'
        })
        console.log('用户拒绝授权');
        return  reject()
      }
    });
  })
}