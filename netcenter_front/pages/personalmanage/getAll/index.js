// pages/repairFunction/personalmanage/getAll/index.js
var config = require('../../../config')
var util = require('../../../utils/util.js')
// pages/functionpages/zuoye.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '',
    serviceman: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getWorker(){
    var that = this
    var identity = wx.getStorageInfoSync('info').identity
    console.log(identity)
    wx.request({
      url: `${config.host}/workmanGet`,
      method: 'Get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        identity: identity
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getWorker()
  },

  check: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item;
    console.log('item=', item)
    try {
      wx.setStorageSync('workman', item)
    } catch (e) { }
    wx.navigateTo({
      url: '../getDetail/index',
    })
  },
  workmanDelete(id,index) {
    console.log('id',id)
    var that=this
    var identity = wx.getStorageSync('info').identity
    console.log(identity)
    wx.showLoading({
      title: '删除中'
    })
    wx.request({
      url: `${config.host}/workmanDelete`,
      data: {
        id: id,
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
        console.log(res)
        if (res.data.status == '001' || res.data.status == '004') {
          console.log("no data!");
          wx.showModal({
            title: '删除失败',
            content: '请稍后重试',
          })
          // util.showModel('该维修人员不存在');
          // util.showModel('学工号不存在');
        } else if (res.data.status == '002' ){
          wx.showModal({
            title: '删除失败',
            content: '无权限',
          })
        } else if (res.data.status == '003') {
          wx.showModal({
            title: '删除失败',
            content: '数据库错误',
          })
        } else if (res.data.status == '100'){
          // util.showModel('删除成功');
          console.log("success!");
          var rlist = that.data.serviceman
          console.log("rlist1:", rlist)
          rlist.splice(index, 1)
          that.setData({
            serviceman: rlist
          })

        }
      },
      fail: function (res) {
        console.log("error!");
        // util.showModel('访问网络失败，请检查网络');
      },
    })
  },
  //删除维修人员
  change: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item;
    var index = e.currentTarget.dataset.index;
    var id = item.id;
    console.log("id:", id)
    console.log(item)
    wx.showModal({
      title: '提示',
      content: '确认删除该维修人员？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.workmanDelete(id,index)
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {
  //   var that = this
  //   wx.showLoading({
  //     title: '正在获取信息'
  //   })
  //   setTimeout(function () {
  //     wx.request({
  //       url: `${config.service.host}/weapp/rservicelist`,
  //       data: {

  //       },
  //       method: 'Get',
  //       header: {
  //         'content-type': 'application/json' // 默认值
  //       },
  //       complete() {
  //         wx.hideLoading()
  //       },
  //       success: function (res) {
  //         console.log(res.data);
  //         if (res.data == '') {
  //           console.log("no data!");
  //         } else {
  //           that.setData({
  //             serviceman: res.data
  //           })
  //           console.log("success load");
  //         }
  //       },
  //       fail: function (res) {
  //         console.log(res);
  //         console.log("error!");
  //       },
  //     })
  //   }, 0);
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})