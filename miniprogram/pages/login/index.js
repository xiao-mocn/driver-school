Page({

  data: {
    loginType: 'student',
    angle: 0,
    loginForm: {
      username: '',
      password: ''
    },
    checked: false,
  },

  onLoad: function(options) {
    this.getUserInfo()
  },
  //首次点击允许获取用户信息并且授权
  getUserInfo: function (e) {
    // var that = this
    // if(e.detail.userInfo != undefined){
    //   var userInfo = e.detail.userInfo
    //   wx.setStorageSync('userInfo', userInfo);
      // wx.getUserInfo().then(res1 => {
      //   console.log("数据",res1);
        
        // var bmobUser = res1.result;
        // if (bmobUser.avatarurl == '' || bmobUser.avatarurl == undefined) {
        //   wx.u.changeUserInfo(userInfo.avatarUrl, userInfo.nickName).then(res2 => { });
        // }
        // this.showlogin(false);
        // wx.setStorageSync('userInfo', res1.result)
        // wx.reLaunch({
        //   url: '/pages/_index/index/index'
        // })
        // that.setData({
        //   userInfo: res1.result,
        // })
      // })
    // }
  },
  onReady: function() {

  },

  onShow: function() {
    // var that = this
    // wx.getUserInfo({
    //   success(res) {
    //     wx.u.getUserInfo().then(res1 => {
    //       console.log("数据",res1)
    //       var bmobUser = res1.result;
    //       if (bmobUser.avatarUrl == '' || bmobUser.avatarUrl == undefined) {
    //         wx.u.changeUserInfo(res.userInfo.avatarUrl, res.userInfo.nickName).then(res2 => { });
    //       }
    //       wx.setStorageSync('userInfo', res1.result)
    //       that.setData({
    //         userInfo: res1.result,
    //         finish: true,
    //       })
    //     })
    //   }
    // })
  },
  handleChangeEntry(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      loginType: type
    })

  },
  submitLogin: function (e) {
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: (res) => {
        console.log(res)
        // wx.setStorageSync('userInfo', res.userInfo)
        // wx.reLaunch({
        //   url: '/pages/_index/index/index'
        // })
      }
    })
    // const username = e.detail.value.username;
    // const password = e.detail.value.password;
    // const type = this.data.loginType;
    // console.log(username, password, type)
    // if (username == '' || password == '') {
    //   wx.showToast({
    //     title: '请输入账号和密码',
    //     icon: 'none'
    //   })
    //   return
    // }
    // if (!this.data.checked) {
    //   wx.showToast({
    //     title: '请勾选用户隐私协议',
    //     icon: 'none'
    //   })
    //   return
    // }
    // switch (type) {
    //   case 'student':
    //     this.redirectToStudent(username, password)
    //     // wx.reLaunch({
    //     //   url: '/pages/student/home/index'
    //     // })
    //     break;
    //   case 'coach':
    //     this.redirectToCoach(username, password)
    //     // wx.reLaunch({
    //     //   url: '/pages/student/home/index'
    //     // })
    //     break;
    //   case 'boss':
    //     this.redirectToBoos(username, password)
    //     // wx.reLaunch({
    //     //   url: '/pages/student/home/index'
    //     // })
    // }
  },
  redirectToStudent(username, password) {
    
  },
  redirectToCoach(username, password) {

  },
  redirectToBoos(username, password) {

  },
  goToPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/index'
    })
  },
  handleCheck() {
    this.setData({
      checked: !this.data.checked
    })
  }
})