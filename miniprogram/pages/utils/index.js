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

export const getCurrentDate = (format) => {
  // 根据forrmat格式返回当前日期
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
  const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
  // 默认格式
  if (!format) {
    return `${year}-${month}-${day}`;
  }
  return format.replace(/YYYY/g, year)
              .replace(/MM/g, month)
              .replace(/DD/g, day)
}

export const checkLoginAndNavigate = (url) => {
  const userInfo = wx.getStorageSync('userInfo')
  if (userInfo) {
    wx.navigateTo({
      url: url
    });
  } else {
    wx.showModal({
      title: '提示',
      content: '您还未登录，请先登录。',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login' // 跳转到登录页面
          });
        }
      }
    });
  }
}