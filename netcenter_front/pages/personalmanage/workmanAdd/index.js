// pages/repairFunction/personalmanage/workmanAdd/index.js
var config = require('../../../config')
var util = require('../../../utils/util.js')
var id = '';
var phone = '';
const app = getApp();

Page({
  data: {
    studyid: '',
    phone: '',
    identical1: '',
    userInfo: {},
    info: [],
    value: {},
    openid: '',
    disabled: true, // 禁用
  },
  onLoad: function(options) {},
  //获取用户输入的详细信息
  Identical: function(e) {
    var that = this

    id = e.detail.value

    console.log('id=', id)
  },
  phone: function(e) {
    var that = this

    phone = e.detail.value
  },
  onShow: function() {

  },
  workmanAdd() {
    wx.showLoading({
      title: '添加中'
    })
    console.log('id', id)
    wx.request({
      url: `${config.host}/workmanCheck`,
      data: {
        id: id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      }, 
      success: function(res) {
        console.log(res)
        //返回信息为空则不是管理员
        if (res.data.status == 'false') {
          wx.showModal({
            title: '添加失败',
            content: '该人员并未绑定账号',
          })
        } else if (res.data.identity == '2') { //为维修人员
          wx.showModal({
            title: '添加失败',
            content: '该人员已是维修人员',
          })

        } else { //否则即不为维修人员
          console.log("res data", res.data);
          wx.request({
            url: `${config.host}/workmanAdd`,
            data: {
              id: id,
              phone: phone
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            complete() {
              wx.hideLoading()
            },
            success: function(res) {
              console.log(res.data)
              if (res.data.status == 'true') {
                util.showSuccess('添加成功');
              } else {
                wx.showModal({
                  title: '添加失败',
                  content: '请稍后重试',
                })
              }
            },
            fail: function() {
              console.log("error")

            },
            complete: function(res) {
              // complete
              console.log("调用完成");
              console.log(res.data);
            }
          })
        }
      },
      fail: function(res) {
        console.log("check existence error!");
      },
    })
  },
  //当用户提交数据
  formSubmit: function(e) {
    var that = this
    console.log('id=', id)
    if (id == '' || phone == '') {
      wx.showModal({
        title: '提示',
        content: '请输入完整信息',
      })
    } else {
      //检查该用户是不是维修人员，不可以重复添加
      that.workmanAdd()
    }
    setTimeout(function() {
      that.setData({
        studyid: '',
        phone: '',
        email: ''
      })
    }, 2000)
  },
})