var config = require('../../../config')
var util = require('../../../utils/util.js')
const app = getApp()
var code = null
var openid = null

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: false,
  },
  onLoad: function () {
    // 页面加载时调用
    this.signup() // 获取用户信息
    // 判断用户当前基础库是否支持getUserProfile，否则使用匿名的getUserInfo
    if(wx.getUserProfile!=undefined){
      this.setData({
        canIUse: true
      })
    }
    if (app.globalData.userInfo) {
      //若userInfo不为空且不为匿名信息则则执行
      if(app.globalData.userInfo.nickName!='微信用户'){
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      }
    }
    //  else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
  },
  tapfunc5: function () {
    wx.navigateTo({
      url: '/pages/user/userInstruction/index',
    })
  },
  tapfunc1: function () {
    wx.navigateTo({
      url: '/pages/user/userInfo/BindForm',
    })
  },
  signup(){
    // 请求mysql得到注册用户信息
    // 另外需要getUserProfile/getUserInfo获取用户微信基本信息
    var infoid = wx.getStorageSync('openid')
    wx.request({
      url: `${config.host}/userCheck`,
      data: {
        openid: infoid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 500) {
          // console.log("no data!");
          // wx.showModal({
          //   title: '提示',
          //   content: '请绑定学工号',
          // })
          // util.showModel('账号未绑定', '请绑定学工号');
        } else {
          util.showSuccess('获取信息成功');
          wx.setStorage({
            key: 'info',
            data: res.data,
          })
        }
      },
      fail: function (res) {
        // console.log("error!");
        
      },
    })
  },
  tapfunc2: function () {
    wx.showModal({
      title: '网络中心联系方式',
      content: '0631-5687184',
      showCancel: true,//是否显示取消按钮
      confirmText: "拨号",//默认是“确定”
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          wx.makePhoneCall({
            phoneNumber: '06315687184',
            success: function () {
              console.log("成功拨打电话")
            }
          })
        }
      },
    })      
  },
  tapfunc4: function () {
    wx.navigateTo({
      url: '/pages/user/userUpdate/changeInfo',
    })
  },
  getUserInfo: function (e) {
    // 获取匿名信息
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getUserProfile: function(e){
    // 2021-4-13以后只能通过getUserProfile获取用户详细信息
    // getUserInfo只能获取用户匿名信息
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: (res) =>{
        console.log('fail',res)
      }
    })
  }, 

  test: function () {
    // 登录请求
    wx.login({
      success: res => {
        code = res.code
        //console.log(res.code)// 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx787edf8fd2267fec&secret=0d9a56dd6547d8f22ec0d65d8197bcf9&js_code=' + code + '&grant_type=authorization_code',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        openid = res.data.openid //返回openid
        console.log(res.data.openid)
      }
    })
  }
})
