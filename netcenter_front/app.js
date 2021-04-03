//app.js
var config = require('config')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // res包含code 与 errMsg两个元素
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code) {
          //发起网络请求
          wx.request({
            url: `${config.host}/getOpenid`,
            data: {
              code:res.code
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              // res包含data-openid，通过openid获取更多信息
              // 保存到全局变量中
              wx.setStorageSync('openid', res.data.openid)
              // console.log(that.globalData.openid)
            },
            fail: function () {
              console.log("request error")
            }
          })
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx3f8c6af392a76209&secret=0fe5d68bef929711ee76948335af89e0&js_code=' + res.code + '&grant_type=authorization_code',
          //   data: {},
          //   header: {
          //     'content-type': 'application/json'
          //   },
          //   success: function (res) {
          //     // 保存到全局变量中
          //     wx.setStorageSync('openid', res.data.openid)
          //     // console.log(that.globalData.openid)
          //   },
          //   fail: function () {
          //     console.log("request error")
          //   }
          // })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    // 2021-4-13以后，getUserInfo只能获取用户匿名信息，无法自动读取用户信息
    // 因此需要主动的使用button组件来调用getUserProfile获取用户信息，故这里的全局函数将会失效
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('up',res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
            ,fail: res => {
              console.log('fail',res)
            }
          })
        }
      }
    });
    wx.cloud.init({
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      //env: 'test1-0ihq5',
      traceUser: true,
    });
  },
   
  globalData: {
    userInfo: null
  }
})