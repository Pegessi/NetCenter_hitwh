// pages/lostcard/manageAll/index.js
var config = require('../../../config')
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  fnGetInfofromServer() {
    let that = this;
    let query_string = "";
    let classification = "";

    this.setData({
      bLoading: false
    })
    wx.showLoading({
      title: '正在获取信息'
    })
    wx.request({
      url: `${config.host}/lostcardGetAll`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function (res) {
        console.log('res.data:', res.data)
        that.setData({
          lostCardList: res.data
        })
        console.log('lostCardList', that.data.lostCardList)
      },
      fail: console.error
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fnGetInfofromServer()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})