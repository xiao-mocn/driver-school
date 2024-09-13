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
export const requestSubscribeMessage = function () {
  return new Promise((resolve, reject) => {
    wx.requestSubscribeMessage({
      tmplIds: ['9gYLIXnaZszuCzgDVZ8etmDoLQly1OFdXhja8zhwWHg', 'Qus8uX0lGkzgNNRNV_nG8XwEBmE4ubAhBWm5ObS94kQ'], // 你的模板ID
      success(res) {
        resolve()
      },
      fail(err) {
        console.log('用户拒绝授权', err);
        wx.showToast({
          title: '请订阅消息通知',
          icon: 'none'
        })
        return reject()
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
  const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
  const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
  const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
  // 默认格式
  if (!format) {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  return format.replace(/YYYY/g, year)
              .replace(/MM/g, month)
              .replace(/DD/g, day)
              .replace(/hh/g, hours)
              .replace(/mm/g, minutes)
              .replace(/ss/g, seconds);
}

// utils/upload.js
export const uploadFileToCloud = (filePath, fileName, oldFileID) => {
  return new Promise(async (resolve, reject) => {
    if (oldFileID) {
      await deleteFileToCloud([oldFileID])
    }
    wx.cloud.uploadFile({
      cloudPath: `uploads/userAvatar/${fileName}`, // 云存储路径
      filePath, // 本地文件路径
      success: res => {
        console.log('File uploaded:', res.fileID);
        resolve(res.fileID);
      },
      fail: err => {
        console.error('File upload failed:', err);
        reject(err);
      }
    });
  });
};
export const deleteFileToCloud = (fileList) => {
  return new Promise((resolve, reject) => {
    wx.cloud.deleteFile({
      fileList,
      success: res => {
        resolve(res.fileList);
        console.log('File deleted successfully:', res.fileList);
      },
      fail: err => {
        reject(err)
        console.error('Failed to delete file:', err);
      }
    })
  })
};
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