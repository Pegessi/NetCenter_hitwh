// pages/centerOperation/getAll/index.js
var config = require('../../../config')
var util = require('../../../utils/util.js')
var info = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    file: {},
    fname: '',
    flink: '',
    sname: '',
    flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '正在获取信息'
    })
    //调用存储在本地的学号信息
    // wx.getStorage({
    //   key: 'info',
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       info: res.data
    //     })
    //   },
    // })

      // console.log(that.data.info);
      // that.setData({
      //   sname: that.data.info.id
      // })
      //console.log(that.data.sname);
      wx.request({
        url: `${config.host}/fileGetAll`,
        data: {
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        complete() {
          wx.hideLoading()
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.status == 'false') {
            wx.showToast({
              title: '暂无数据',
            })
          } else {
            that.setData({
              file: res.data
            })
            console.log("success load");
            console.log(that.data.file);
          }
        },
        fail: function (res) {
          console.log(res);
          // util.showModel('获取考勤信息失败', '请检查网络连接是否正常');
          console.log("error!");
        },
      })
  },

  jumpweb: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item;
    console.log('item:', item)
    try {
      wx.setStorageSync('downloadItem', item)
    } catch (e) { }
    wx.navigateTo({
      url: '/pages/centerOperation/installFile/index',
    })
    //    var flink = e.currentTarget.dataset.flink;

  },
  show: function () {
    this.setData({ flag: false })
  },
  hide: function () {
    this.setData({ flag: true })
  },
})