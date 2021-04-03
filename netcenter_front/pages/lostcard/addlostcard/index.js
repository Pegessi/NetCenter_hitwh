// pages/lostcard/addlostcard/index.js
var config = require('../../../config')
const app = getApp()
const {
  $Message,
  $Toast
} = require('../../component/iview-ui/base/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showImgUrl: '',
    imageID: [],
    id: '',
    name: '',
    description: '',
    contact: '',
    infoType: '',
    buttonflag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    let userid = wx.getStorageSync('info').id
    that.setData({
      buttonflag: true,
      userid:userid
    })
    if (userid == null || userid == undefined) {
      wx.showModal({
        title: '提示',
        content: '请先登陆哦',
      })
      return
    }else{
      that.setData({
        infoType: options.infoType,
        showflag: false,
        buttonflag: false
      })

      $Toast({
        content: '若看不清学号姓名请直接送至卡务中心哦'
      });
      if (that.data.infoType == 1) {
        wx.setNavigationBarTitle({
          title: '招领'
        })
      } else {
        wx.setNavigationBarTitle({
          title: '失卡'
        })
      }
      //删除本地缓存的图片地址
      // wx.removeStorageSync('files')
    }
    
  },

  myEventListener: function(e) {

  },

  name: function(e) {
    console.log('name', e.detail.detail.value)
    let that = this
    that.setData({
      name: e.detail.detail.value
    })
  },
  cardid: function(e) {
    console.log('id', e.detail.detail.value)
    let that = this
    that.setData({
      id: e.detail.detail.value
    })
  },
  contact: function(e) {
    console.log('contact', e.detail.detail.value)
    let that = this
    that.setData({
      contact: e.detail.detail.value
    })
  },
  description: function(e) {
    console.log('description', e.detail.detail.value)
    let that = this
    that.setData({
      description: e.detail.detail.value
    })
  },
  /**
   * 提交发布
   */
  submitInfo: function(e) {
    let that = this
    // $Toast({
    //   content: '若看不清学号姓名请直接送至卡务中心哦'
    // });
    // 先判断有没有填写学号/姓名之一
    if (that.data.name == that.data.id) {
      wx.showToast({
        title: '请填写学号/姓名',
        icon: 'fail',
        duration: 3000
      });
      return
    }
    let name = that.data.name
    let id = that.data.id
    let description = that.data.description
    let contact = that.data.contact
    let type = that.data.infoType
    let userid=that.data.userid
    console.log(userid)
    wx.showLoading({
      title: '正在添加'
    })
    wx.request({
      url: `${config.host}/lostcardAdd`,
      data: {
        name: name,
        id: id,
        description: description,
        contact: contact,
        type: type,
        submitid: userid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function(res) {
        console.log(res)
        if (res.data.status == 'true') {
          wx.showToast({
            title: '发布成功',
          })

          that.setData({
            id: '',
            name: '',
            description: '',
            contact: '',
            infoType: ''
          })
        } else {
          $Toast({
            content: '发布失败'
          });
        }
        that.setData({
          buttonflag: false
        })
      },
      fail: function(res) {
        console.log('res:', res)
        console.log("这里2")
        wx.showToast({
          title: '发布失败'
        });

        that.setData({
          buttonflag: false
        })
      }
    })

  },
  /**
   * 上传图片
   */
  // chooseImage: function () {
  //   let that=this
  //   var filePath =''
  //   var imgList=[]
  //   // 选择文件
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       //filePath = res.tempFilePaths[0]
  //       // that.setData({
  //       //   picture: filePath
  //       // })        
  //     }
  //   })
  // },

})