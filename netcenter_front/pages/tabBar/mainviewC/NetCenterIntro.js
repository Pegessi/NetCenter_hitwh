// pages/MainInterface/NetCenterIntro.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    tmp: ''
  },
  recommend: function () {
    this.setData({
      show: true
    })
  },

  onClickHide() {
    this.setData({
      show: false
    });
  },

  downloadImg: function () {
    var that = this
    wx.showLoading({
      title: '正在保存',
    })
    wx.cloud.downloadFile({
      fileID: 'cloud://hitwhnetcenter-a3tay.6869-hitwhnetcenter-a3tay-1257168605/小程序.png',
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res)
          var savePath = wx.env.USER_DATA_PATH + '/hitwhNetCenter.png'
          wx.getFileSystemManager().saveFile({
            // 保存临时文件到本地
            tempFilePath: res.tempFilePath,
            filePath: savePath,
            success: (res) => {
              wx.saveImageToPhotosAlbum({
                filePath: savePath,
                success: (res) => {
                  wx.showToast({
                    title: '文件已保存',
                  })
                }
              })
            },
            fail: (res) => {
              console.log(res)
            }
          })
          wx.hideLoading({
            success: (res) => {

            },
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
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