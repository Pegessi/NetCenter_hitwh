// pages/lostcard/searchResult/index.js
var config = require('../../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lostCardList: [],
    hiddenmodalput: true,
    namefalse: true,
  },
  inputcomment: function (e) {
    wx.setStorageSync('inputcomment', e.detail.value)
  },
  /**
   * 带参数跳转：查看失卡招领详情
   */
  fnGoToPageParam(e) {
    let info = e.currentTarget.dataset.item

    wx.navigateTo({
      url: '../getDetail/index?item=' + JSON.stringify(info)  //JSON.stringify(this.data.lostCardList[0][index]),
    })

  },
  fnIdentify(e) {
    var that = this
    if (that.data.identical == 1) {
      that.fnGoToPageParam(e)
    } else {

      this.setData({
        hiddenmodalput: !this.data.hiddenmodalput
      })
      console.log(e.currentTarget.dataset.item)
      let info = e.currentTarget.dataset.item
      that.setData({
        info: info
      })
    }
  },
  confirm: function (e) {
    var that = this
    // console.log(this.item)
    var comment = wx.getStorageSync('inputcomment')
    let info = that.data.info

    that.setData({
      hiddenmodalput: true
    })
    if (comment == info.name) {
      wx.navigateTo({
        url: '../getDetail/index?item=' + JSON.stringify(info)  //JSON.stringify(this.data.lostCardList[0][index]),
      })
    } else {
      that.setData({
        namefalse: false
      })

    }
  },

  cancel: function (e) {
    var that = this
    that.setData({
      hiddenmodalput: true
    })
  },
  cancel2: function (e) {
    var that = this
    // console.log(this.item)

    that.setData({
      namefalse: true
    })
    that.setData({
      comment: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var idList = wx.getStorageSync('idList')
    var that = this
    that.setData({
      lostCardList: idList
    })
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