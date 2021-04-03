// pages/lostcard/getAll/index.js
var change = 1; //change用来控制显示报修页面 or 显示已报修页面
var color1, color2; //选中或者不选中的颜色
var config = require('../../../config')
Page({

  /**
   * 页面的初始数据
   * identity： 权限
   * id: 学号
   * lostCardList: 失卡信息列表
   */
  data: {
    hiddenmodalput: true,
    identity: wx.getStorageSync('info').identity,
    id: wx.getStorageSync('info').id,
    namefalse: true,
    lostCardList: [],
    result: '',
    inputValue: '',
    wordsList: [],
    userList: [],
    change: 1,
    myFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      identity: wx.getStorageSync('info').identity,
      id: wx.getStorageSync('info').id,
    })
  },
  // 根据学号进行查询
  getbyId: function(e) {
    let that = this
    let id = e.detail
    if (id == '' || id == null) {
      that.hideInput()
      return
    }
    let list = that.data.lostCardList
    let idList = []
    let length = list.length
    let j = 0,
      i = 0
    for (i = 0; i < length; i++) {
      if (list[i].submitid == id) {
        idList[j] = list[i]
        j++
      }
    }
    console.log("idList", idList)
    wx.setStorageSync('idList', idList);
    wx.navigateTo({
      url: '../searchResult/index', //0sell
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    this.fnGetInfofromServer();
    that.setData({
      change: 1,
      color1: '#2287e3',
      color2: '#CFCFCF'
    })
  },

  /**
   * 搜索框出现/消失控制
   */
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function() {
    this.setData({
      inputValue: "",
      inputShowed: false
    });
  },
  inputTyping: function(e) {
    //输入搜索内容
    this.setData({
      inputValue: e.detail.value
    });
  },
  //清除输入内容
  clearInput() {
    var that = this
    that.setData({
      inputValue: ''
    })
  },
  //
  /**
   * 菜单按钮控制
   */
  _saleIssue: function() {
    wx.navigateTo({
      url: '../addlostcard/index?infoType=0', //0sell
    })
  },
  _buyIssue: function() {
    wx.navigateTo({
      url: '../addlostcard/index?infoType=1', //1buy
    })
  },
  // _myIssue: function () {
  //   wx.navigateTo({
  //     url: './getDetail? list = ' + this.data.userList,
  //   })
  // },

  /**
   * 加载更多
   */
  // fnLoadMore(event) {
  //   let infotype = event.currentTarget.dataset.type - 0;
  //   let sTimestamp = this.fnGetTimestamp(infotype);
  //   this.fnGetInfofromServer(infotype, sTimestamp);
  // },

  fnGetInfofromServer() {
    let that = this;
    let query_string = "";
    let classification = "";

    this.setData({
      bLoading: false
    })
    wx.showLoading({
      title: '获取信息'
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
      success: function(res) {
        console.log('res:', res)
        if (res.data.status == 'false') {

          wx.showToast({
            title: '获取信息失败',
            icon: 'none',
            duration: 1500
          })
        } else {
          that.setData({
            lostCardList: res.data.data
          })
        }
        console.log('lostCardList', that.data.lostCardList)
      },
      fail: console.error
    })
  },
  //时间戳转换
  fnGetTimestamp(infotype) {
    let sTimestamp = "";
    infotype = infotype - 0;
    let aTempData = (infotype === 0) ? this.data.goodSellList : this.data.goodBuyList;
    let max = aTempData[0][0].create_time;
    let min = max;
    let i, j;
    for (i = 0; i < aTempData.length; i++) {
      if (max < aTempData[i][0].create_time) {
        max = aTempData[i][0].create_time
      }
      if (min > aTempData[i][aTempData[i].length - 1].create_time) {
        min = aTempData[i][aTempData[i].length - 1].create_time
      }
    }
    sTimestamp = min + '-' + max;
    return sTimestamp;
  },

  name: function() {
    console.log('name', e.detail.detail.value)
    let that = this
    that.setData({
      name: e.detail.detail.value
    })
  },

  inputcomment: function(e) {
    wx.setStorageSync('inputcomment', e.detail.value)
  },

  /**
   * 带参数跳转：查看失卡招领详情
   */
  // fnGoToPageParam(e) {
  //   let info = e.currentTarget.dataset.item

  //   wx.navigateTo({
  //     url: '../getDetail/index?item=' + JSON.stringify(info) //JSON.stringify(this.data.lostCardList[0][index]),
  //   })

  // },
  fnIdentify(e) {
    var that = this
    console.log(e.currentTarget.dataset.item)
    let info = e.currentTarget.dataset.item
    if (that.data.identity == 1 || info.submitid == that.data.id) {
      that.fnGoToPageParam(e)
    } else {

      this.setData({
        hiddenmodalput: !this.data.hiddenmodalput
      })
      that.setData({
        info: info
      })
    }
  },
  fnGoToPageParam(e) {
    let info = e.currentTarget.dataset.item

    wx.navigateTo({
      url: '../getDetail/index?item=' + JSON.stringify(info) //JSON.stringify(this.data.lostCardList[0][index]),
    })

  },
  confirm: function(e) {
    var that = this
    // console.log(this.item)
    var comment = wx.getStorageSync('inputcomment')
    let info = that.data.info

    that.setData({
      hiddenmodalput: true
    })
    if (comment == info.name) {
      wx.navigateTo({
        url: '../getDetail/index?item=' + JSON.stringify(info) //JSON.stringify(this.data.lostCardList[0][index]),
      })
    } else {
      that.setData({
        namefalse: false
      })

    }
  },

  cancel: function(e) {
    var that = this
    that.setData({
      hiddenmodalput: true
    })
  },
  cancel2: function(e) {
    var that = this
    // console.log(this.item)

    that.setData({
      namefalse: true
    })
    that.setData({
      comment: ''
    })
  },
  change1: function(e) {
    this.setData({
      change: 1,
      color1: '#2287e3',
      color2: '#CFCFCF',
    })
    this.onShow();
  },

  change2: function(e) {
    var that = this
    console.log(that.data.lostCardList)
    if (that.data.id == null || that.data.id == undefined) {
      wx.showModal({
        title: '提示',
        content: '请先登陆/绑定哦',
      })
    } else {
      // 若查找到了发布记录 置myFlag为false
      var tmp = that.data.myFlag
      if (that.data.lostCardList != undefined){
        for (var i=0,len=that.data.lostCardList.length;i<len;i++){
          if (that.data.id==that.data.lostCardList[i].submitid){
            tmp = false;
          }
        }
      }
      this.setData({
        change: 2,
        color2: '#2287e3',
        color1: '#CFCFCF',
        myFlag: tmp
      })
    }
  }

})