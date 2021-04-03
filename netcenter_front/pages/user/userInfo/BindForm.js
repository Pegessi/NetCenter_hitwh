var config = require('../../../config')
var util = require('../../../utils/util.js')

var openid = ''
var getID = null
var getName = null
var email = null
var phone = null
var info1 = {}
var showFlag
Page({
  data: {
    email: ""
  },
  //获取输入学工号
  getID: function(e) {
    var regNum = new RegExp('[0-9]', 'g');
    var rsNum = regNum.exec(e.detail.value);
    if (rsNum != null) {
      getID = e.detail.value;
      console.log(getID);
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入数字',
      })
    }
  },
  //获取输入姓名
  getname: function(e) {
    getName = e.detail.value;
    console.log(getName);
  },
  //获取用户输入的电子邮箱地址
  email: function(e) {
    email = e.detail.value;
    console.log("email", email);
    let that = this
    //let email = e.detail.value // 获取输入框的数据
    that.setData({
      email:email
    })
  },
  //获取用户输入的手机号
  // phone: function (e) {
  //   phone = e.detail.value;
  //   console.log("phone", phone);
  // },
  //加载函数，从数据库通过openid查找有没有该学号，如果有返回mainviewA
  onLoad: function() {
    var that = this
    openid = wx.getStorageInfoSync("openid")
    that.setData({
      openid: openid
    })
    //获取info
    var infoid = wx.getStorageSync('openid')
    wx.request({
      url: `${config.host}/userCheck`,
      data: {
        openid: infoid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res)
        if (res.data.status == 'false') {
          // console.log("no data!");
          that.setData({
            info: ''
          })
          that.setData({
            info1: ''
          })

          wx.setStorage({
            key: 'info',
            data: ''
          })
          that.setData({
            showFlag: 1
          })      
          wx.showModal({
            title: '提示',
            content: '请绑定学工号',
          })
          // util.showModel('账号未绑定', '请绑定学工号');
        } else if(res.data.status=='true'){
          util.showSuccess('获取信息成功');
          that.setData({
            info1: res.data
          })

          that.setData({
            showFlag: 2
          })
          wx.setStorage({
            key: 'info',
            data: that.data.info1,
          })
          // setTimeout(function () {
          //   wx.switchTab({
          //     url: '../MainInterface/MainviewA',
          //   })
          // }, 800)  
        }else{
          // console.log("no data!");
          that.setData({
            info: ''
          })
          that.setData({
            info1: ''
          })

          wx.setStorage({
            key: 'info',
            data: ''
          })
          that.setData({
            showFlag: 1
          })
          wx.showModal({
            title: '提示',
            content: '请绑定学工号',
          })
        }
      },
      fail: function(res) {
        // console.log("error!");
        wx.showModal({
          title: '提示',
          content: '请绑定学工号',
        })
      },
    })
    // }, 80);
  },

  formsubmit: function(e) {
    console.log(e.detail.formId)
    var identity = '3'
    var formid = e.detail.formId
    var that=this
    openid = wx.getStorageSync('openid')
    //向服务器发送请求绑定
    if (getID == '9918007') {
      identity = '1'
    } else {
      identity = '3'
    }
    if (getName == '' || getName == null) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
      })
    } else if (email == '' || email == null) {
      wx.showModal({
        title: '提示',
        content: '请输入邮箱',
      })
    }
    
    else {

      console.log('identity', identity)
      console.log('name', getName)
      console.log('id', getID)
      console.log('email', email)
      console.log('openid', openid)
      wx.request({
        url: `${config.host}/userAdd`,
        data: {
          openid: openid,
          id: getID,
          name: getName,
          email: email,
          identity: identity
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
          console.log(res.data)
          if (res.statusCode == 200 && res.data.status == "true") {
            // util.showSuccess('绑定成功');
            wx.getStorage({
              key: 'openid',
              success: function(res) {
                if (res.data.status == "true")
                  infoid = res.data
              },
            })
            
            wx.redirectTo({
              url: '../../user/userInfo/BindForm',
            })
          } else if(res.data.status=="false") {

            wx.showModal({
              title: '失败',
              content: '服务器错误',
            })
            // util.showModel('提交失败', '服务器错误');
          }

        },
        fail: function() {
          // fail
          wx.showModal({
            title: '失败',
            content: '服务器错误',
          })
        },
        complete: function(res) {
          // complete
          console.log("调用完成");
          console.log(res.data);
        }
      })
    }
    // }, 50)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },
  //解除绑定事件
  unbind: function(e) {
    console.log("tableid:", wx.getStorageSync('info').tableid)
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要解除绑定嘛？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          

          //删除数据库中的信息---------------
          wx.request({
            url: `${config.host}/userDelete`,
            data: {
              tableid: wx.getStorageSync('info').tableid
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              console.log(res.data)
              if (res.data.status == "true") {
                //删掉屏幕上的信息
                that.setData({
                  info: ''
                })
                that.setData({
                  info1: ''
                })

                wx.setStorage({
                  key: 'info',
                  data: ''
                })
                that.setData({
                  showFlag: 1
                })
                util.showSuccess('解绑成功');
          //删除结束------------------------------
          }
                
              else{

                wx.showModal({
                  title: '失败',
                  content: '服务器错误',
                })
              }
            },
            fail: function() {
              wx.showModal({
                title: '失败',
                content: '服务器错误',
              })
            },
            complete: function(res) {
              console.log(res.data)
            }
          })
          //删除over-----------------------------
        } else {

        }
      }
    })
  }
})