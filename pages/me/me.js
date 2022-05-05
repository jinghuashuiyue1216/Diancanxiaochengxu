// pages/me/me.js
const app = getApp();
Page({
  // 页面的初始数据
  data: {
    userInfo: null,
  },
  onShow(options) {
    //微信用户信息
    var userStor = wx.getStorageSync('user');
    if (userStor && userStor.nickName) {
      console.log('本地获取微信用户信息', userStor)
      this.setData({
        userInfo: userStor,
      })
    } else {
      this.setData({
        userInfo: null,
      })
    }
    // 获取Java用户信息和会员信息
    this.getVipInfo()
  },
  // 获取Java用户信息和会员信息
  getVipInfo() {
    let that=this
    wx.request({
      url: app.globalData.baseUrl + '/user/getUserInfo',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        console.log("个人中心Java后台返回的用户信息", res.data)
        if (res && res.data && res.data.data) {
          app._updateVipInfo(res.data.data)
          // java用户信息和会员信息
          var user = app.globalData.vipInfo;
          if (user.viptime && user.viptime > 0) {
            let shengyu = user.viptime - new Date().getTime()
            console.log("会员剩余时间", shengyu)
            that.setData({
              shengyu,
              vipTimeStr: app._getCurrentTime(user.viptime)
            })
          }
        }
      }
    })
  },
  //获取微信用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取用户信息成功", res)
        let user = res.userInfo
        this.setData({
          userInfo: user,
        })
        wx.setStorageSync('user', user)

      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },
  //退出登录
  tuichu() {
    wx.setStorageSync('user', null)
    this.setData({
      userInfo: null,
    })
  },

  goToMyOrder: function () {
    wx.navigateTo({
      url: '../myOrder/myOrder',
    })
  },

  goToMyComment: function () {
    wx.navigateTo({
      url: '../mycomment/mycomment?type=1',
    })
  },
  goToPaiHao() {
    wx.navigateTo({
      url: '../paihao/paihao',
    })
  },
  //饭店电话
  goToPhone() {
    wx.makePhoneCall({
      phoneNumber: '15611823564' //仅为示例，这个号码也是石头哥的微信号
    })
  },
  change() {
    wx.navigateTo({
      url: '../change/change',
    })
  },
  //去注册会员页
  goVip() {
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  }
})