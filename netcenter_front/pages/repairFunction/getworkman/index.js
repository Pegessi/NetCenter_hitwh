// pages/repairFunction/getworkman/index.js
var config = require('../../../config')
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repairlist: {},
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    //读出该维修人员的待接单/完成维修记录
    that.getList(options.workmanid)
  },


  onPullDownRefresh: function () {
    // var that = this
    // var t1 = Date.now();
    // that.setData({
    //   current: t1
    // })
    // this.onShow();
    // wx.stopPullDownRefresh();
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
  getList(workmanid){
    var that=this
    wx.showLoading({
      title: '正在获取信息'
    })
    wx.request({
      url: `${config.host}/repairforworkman`,
      data: {
        id: workmanid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 'false') {
          console.log("no data!");
          // that.setData({
          //   repairlist: {'暂无'
          // })
        } else if(res.data.status == 'true' && res.data.data!='' && res.data.data!=undefined && res.data.data!=null ){
          that.setData({
            repairlist: res.data.data
          })
          console.log("success load");
        }else{
          that.setData({
            repairlist: {}
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '获取信息失败',
          icon: 'none',
          duration: 1500
        })
        console.log(res);
        console.log("error!");
      },
    })
  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    var that = this
    var t1 = Date.now();
    that.setData({
      current: t1
    })
    this.onShow();
    wx.stopPullDownRefresh();
  },

  check: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item;
    try {
      wx.setStorageSync('zuoyeanswer', item)
    } catch (e) { }
    if (that.data.info.identical == '0') {
      wx.navigateTo({
        url: '/pages/functionpages/szuoye',
      })
    }
  },

  check1: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item;
    try {
      wx.setStorageSync('zuoyeanswer', item)
    } catch (e) { }
    if (that.data.info.identical == '1') {
      wx.navigateTo({
        url: '/pages/functionpages/czuoye',
      })
    }
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

  },
  // del: function (e) {
  //   //console.log(e.currentTarget.dataset.item)
  //   var that = this
  //   var tableid = e.currentTarget.dataset.item.tableid
  //   //console.log(tableid)
  //   var id = e.currentTarget.dataset.index
  //   console.log("id:", id)
  //   this.onLoad();
  //   wx.showModal({
  //     title: '提示',
  //     content: '是否确认删除',
  //     success: function (res) {
  //       if (res.confirm) {
  //         var rlist = that.data.repairlist
  //         console.log("rlist1:", rlist)
  //         rlist.splice(id, 1)
  //         that.setData({
  //           repairlist: rlist
  //         })
  //         wx.request({
  //           url: `${config.host}/changeSF`,
  //           data: {
  //             submitid: submitid,
  //             showFlag: 0   //0即为不显示
  //           },
  //           method: 'POST',
  //           header: {
  //             'content-type': 'application/json' // 默认值
  //           },
  //           success: function (res) {
  //             if (res.data == '') {
  //               console.log("no data!");
  //             } else {
  //               console.log("success!");
  //               console.log(res.data)
  //             }
  //           },
  //           fail: function (res) {
  //             console.log("error!");
  //             // util.showModel('访问网络失败，请检查网络');
  //           },
  //         })
  //         console.log('确定')

  //       } else {
  //         console.log('取消')
  //       }
  //     },
  //   })
  // }
})