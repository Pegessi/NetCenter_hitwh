// pages/lostcard/getDetail/index.js
// pages/FunctionPages/LostCard/detail.js
var config = require('../../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: wx.getStorageSync('info').id,
    identity: wx.getStorageSync('info').identity,
    detail: [],
    picture: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options.item)
    let detail = JSON.parse(options.item)
    console.log(detail)
    that.setData({
      detail: detail,
      userid: wx.getStorageSync('info').id,
      identity: wx.getStorageSync('info').identity
    })

  },
  // 复制联系方式到剪贴板
  fnCopyContact(event) {
    let value = event.currentTarget.dataset.value.replace(/[^0-9]/ig, "") //正则提取数字
    wx.setClipboardData({
      data: value,
      success: function (res) {
        wx.showToast({
          title: '已复制',
          icon: 'none',
          duration: 2000,
          mask: false,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 2000,
          mask: false,
        })
      },
      complete: function (res) { },
    })
  },
  //删除
  deleteInfo: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      success: function (res) {
        if (res.confirm) {

          that.changeflag()
          console.log('确定')

        } else {
          console.log('取消')
        }
      },
    })    
  },
  changeflag(){
    var that = this
    wx.showLoading({
      title: '正在删除'
    })
    wx.request({
      url: `${config.host}/lostcardChange`,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        tableid: that.data.detail.tableid
      },
      complete() {
        wx.hideLoading()
      },
      success: function (res) {
        console.log('res', res)
        if (res.data.status == 'true') {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 3000
          });
          wx.navigateBack({
            delta: 1,
          })
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'fail',
            duration: 3000
          });
        }
      },
      fail: console.error
    })
  }
})