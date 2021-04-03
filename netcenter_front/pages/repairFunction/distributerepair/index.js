// pages/repairFunction/distributerepair/index.js
var config = require('../../../config')
var util = require('../../../utils/util.js')
var workman, tableid;
var distributeFlag;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '',
    serviceman: {},
    repairid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    console.log(options.repairid)
    tableid = options.repairid
    this.setData({
      repairid: tableid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.showLoading({
      title: '正在获取信息'
    })
    //读出所有的维修人员
      wx.request({
        url: `${config.host}/workmanGet`,
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
            console.log("no data!");
          } else {
            that.setData({
              serviceman: res.data
            })
            console.log("success load");
          }
        },
        fail: function (res) {
          console.log(res);
          console.log("error!");
        },
      })
  },
  //读取某个维修人员的维修任务列表
  check: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item;
    console.log(item)
    wx.navigateTo({
      url: '../getworkman/index?workmanid='+item.id,
    })
  },
  // 为某一个维修人员添加维修任务
  addrepair: function (e) {
    var that = this
    var identity = wx.getStorageSync('info').identity
    console.log(identity)
    var item = e.currentTarget.dataset.item;
    console.log('item', item)
    workman = item.id
    var manageid = wx.getStorageSync('info').id
    var tableid = that.data.repairid
    var email = item.email
    var name = item.name
    console.log(tableid)
    wx.showLoading({
      title: '正在分配'
    })
    wx.request({
      url: `${config.host}/repairDistribute`,
      data: {
        manageid: manageid,
        email:email,
        workmanid: workman,
        tableid: tableid,
        identity: identity
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == '001' || res.data.status == '004') {
          console.log("no data!");
          distributeFlag = false;
          wx.showModal({
            title: '分配失败',
            content: '请稍后再试',
          })
        } else if (res.data.status == '002') {
          distributeFlag = false;
          wx.showModal({
            title: '分配失败',
            content: '无权限',
          })
        } else if (res.data.status == '003') {
          distributeFlag = false;
          wx.showModal({
            title: '分配失败',
            content: '数据库错误',
          })
        } else if (res.data.status == '100') {

          util.showSuccess('等待' + name + '接单')
          
          // wx.navigateBack({
          //   url: '/pages/ManagePages/findRepair',
          // })
        } else {
          console.log(res);
          console.log("error!");
          distributeFlag = false;
        }
      },
      fail: function (res) {
        console.log(res);
        console.log("error!");
        distributeFlag = false;
      },
    })
    

  },

  // submit: function () {
  //   wx.navigateTo({
  //     url: '/ManagePages/alterRepair',
  //   })
  // },
})