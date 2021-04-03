// pages/centerOperation/installFile/index.js
var config = require('../../../config')
var util = require('../../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    disableFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      item: wx.getStorageSync('downloadItem'),
      disableFlag:false
    })
    that.setData({
      info: wx.getStorageSync('info')
    })
  },
  download(){
    var that=this
    var fileUrl=''
    wx.showLoading({
      title: '正在下载'
    })
    wx.cloud.init({
      env: 'storage'
    })
    wx.cloud.getTempFileURL({
      fileList: ['cloud://hitwhnetcenter-a3tay.6869-hitwhnetcenter-a3tay-1257168605/'+wx.getStorageSync('downloadItem').flink],
      //['cloud://hitwhnetcenter-a3tay.6869-hitwhnetcenter-a3tay-1257168605/IPandDomain.doc'],// 文件 ID
      success: res => {
        // fileList 是一个有如下结构的对象数组
        // [{
        //    fileID: 'cloud://xxx.png', // 文件 ID
        //    tempFileURL: '', // 临时文件网络链接
        //    maxAge: 120 * 60 * 1000, // 有效期
        // }]
        console.log(res.fileList)
        fileUrl = res.fileList[0].tempFileURL
        console.log(fileUrl)
        wx.request({
          url: `${config.host}/fileDownload`,
          data: {
            email: wx.getStorageSync('info').email,
            fileUrl: fileUrl,
            fname: wx.getStorageSync('downloadItem').fname
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          complete() {
            that.setData({
              disableFlag: false
            })
            wx.hideLoading()
          },
          success: function (res) {
            console.log(res)
            if (res.data.status == "false") {
              util.showModel('错误', '请重试');
              wx.showToast({
                title: '下载失败',
                icon: 'none',
                duration: 1500
              })
            } else if (res.statusCode == 200) {
              util.showModel('下载成功', '请检查您的邮箱');
            } else {
              wx.showToast({
                title: '下载失败',
                icon: 'none',
                duration: 1500
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '下载失败',
              icon: 'none',
              duration: 1500
            })
            console.log(res);
            console.log("error!");
          },
        })

      },
      fail: console.error
    })
    
  },
  formSubmit: function () {
    var that = this;
    // console.log(that.data.info)    

    if (that.data.info.id == null || that.data.info.id == undefined) {
      wx.showModal({
        title: '提示',
        content: '请先登陆/绑定哦',
      })
    } else{
      that.setData({
        disableFlag:true
      })
      that.download()
      // that.download1()
    }
      
  },
  download1:function(){
    wx.cloud.init({
      env: 'storage'
    })
    wx.cloud.getTempFileURL({
      fileList: ['cloud://hitwhnetcenter-a3tay.6869-hitwhnetcenter-a3tay-1257168605/IPandDomain.doc'],// 文件 ID
      success: res => {
        // fileList 是一个有如下结构的对象数组
        // [{
        //    fileID: 'cloud://xxx.png', // 文件 ID
        //    tempFileURL: '', // 临时文件网络链接
        //    maxAge: 120 * 60 * 1000, // 有效期
        // }]
        console.log(res.fileList)
      },
      fail: console.error
    })
  }
})