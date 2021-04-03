var config = require('../../../config')
var bOneOver = false;
var oProblemList = {};
var aListKeys = [];
var dic = {}
Page({
  data: {
    oProblemList: {}
  },

  onLoad: function (options) {
    // this.fnManageList()
    wx.showLoading({
      title: '正在获取信息'
    })
    this.fnGetProblemList();
    this.fnGetTypeList();
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
    wx.setStorage({
      key: 'questionList',
      data: dic
    })
    //wx.setStorageSync('questionList', dic)
    this.setData({
      oProblemList: dic,
      aListKeys: Object.keys(dic),
    })
  },

  fnGetTypeList() {
    let that = this
    wx.request({
      url: `${config.host}/questionTypeGetAll`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('res2:', res)

        if (res.statusCode === 200) {
          aListKeys = res.data;
          wx.setStorageSync('questionType', aListKeys)
          if (bOneOver) {
            that.fnManageList();
          } else {
            bOneOver = true;
          }
        } else {
          console.log("error")
        }
      },
      fail: console.error
    })
  },

  fnGetProblemList() {
    let that = this
    wx.request({
      url: `${config.host}/questionGet`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function (res) {
        console.log('res1:', res)
        if (res.statusCode === 200) {
          oProblemList = res.data.data;
          if (bOneOver) {
            that.fnManageList();
          } else {
            bOneOver = true;
          }
        } else {
          console.log("error")
        }
      },
      fail: console.error
    })
  }
})
