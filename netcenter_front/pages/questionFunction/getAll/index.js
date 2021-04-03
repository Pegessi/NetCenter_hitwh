// pages/questionFunction/getAll/index.js
var config = require('../../../config')
var bOneOver = false;
var oProblemList = {};
var aListKeys = [];
var dic = {}
Page({
  data: {
    oProblemList: {},
    questionTypeList:{},
    questionList:{},
  },

  onLoad: function (options) {
    // this.fnManageList()
    wx.showLoading({
      title: '正在获取信息'
    })
    this.fnGetProblemList();
    // this.fnGetTypeList();
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },

  //构造成字典格式
  fnManageList() {
    dic = {} //声明一个字典

    console.log('oProblemList:', oProblemList)
    console.log('aListKeys:', aListKeys)

    //遍历所有问题，将其分类构造字典
    for (let i = 0; i < oProblemList.length; i++) {
      let id = oProblemList[i].type;
      let key = aListKeys[id - 1].type;
      let tmpList = [];
      if (dic[key] != undefined) {
        tmpList = dic[key];
      }
      tmpList.push(oProblemList[i])
      dic[key] = tmpList;
    }
    console.log(dic)
    // wx.setStorage({
    //   key: 'questionList',
    //   data: dic
    // })
    //wx.setStorageSync('questionList', dic)
    this.setData({
      oProblemList: dic,
      aListKeys: Object.keys(dic),
    })
  },
  //get all question type
  fnGetTypeList() {
    let that = this
    wx.request({
      url: `${config.host}/questionTypeGet`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function (res) {
        console.log('getQT:', res)
        if (res.data.status == 'false') {
        } else {
          // wx.setStorageSync('questionType', aListKeys)
          that.setData({
            questionTypeList: res.data
          })
          if (bOneOver) {
            // that.fnManageList();
          } else {
            bOneOver = true;
          }
        }
      },
      fail: console.error
    })
  },

  //获取所有问题列表
  fnGetProblemList() {
    let that = this
    wx.request({
      url: `${config.host}/questionGetAll`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('getQ:', res)
        if (res.data.status == 'false') {
          wx.showToast({
            title: '获取信息失败',
            icon: 'none',
            duration: 2500
          })
        } else {
          that.setData({
            questionList: res.data.data
          })
          that.fnGetTypeList();
          // oProblemList = res.data;
          if (bOneOver) {
          } else {
            bOneOver = true;
          }

        }
      },
      fail: console.error
    })
  }
})
