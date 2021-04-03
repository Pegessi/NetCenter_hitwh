// pages/repairFunction/workrepair/index.js
var util = require('../../../utils/util.js')
var config = require('../../../config')
var change = 1;
Page({
  data: {
    repairlist: {}, //未接单
    repairlistunfinish: {}, //已接单未完成
    //    repairlistfinished: {}, //已完成
    id: '',
    hiddenmodalput: true,
    item: {}
  },
  onLoad: function(options) {
    var that = this
    this.setData({
        change: 1,
        color1: '#2287e3',
        color2: '#CFCFCF',
        color3: '#CFCFCF',
      }),
      that.setData({
        id: wx.getStorageSync('info').id
      })
  },

  getUnaccepted: function() {
    var that = this
    //读出待接单
    console.log(that.data.id)
    wx.showLoading({
      title: '正在获取信息'
    })
    wx.request({
      url: `${config.host}/repairUnaccepted`,
      data: {
        userid: that.data.id
      },
      method: 'Get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function(res) {
        console.log(res.data);
        if (res.data.status == 'false') {
          console.log("no data!");
          that.setData({
            repairlist: []
          })
        } else {
          that.setData({
            repairlist: res.data.data
          })
          console.log("success load");
        }
      },
      fail: function(res) {
        console.log(res);
        console.log("error!");
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    //读出待接单
    that.getUnaccepted()

    console.log('repairlist:', this.data.repairlist)
    console.log('repairlistunfinish:', this.data.repairlistunfinish)
    //console.log('repairlistfinished:', this.data.repairlistfinished)
  },

  //

  change1: function(e) {
    var that = this
    this.setData({
        change: 1,
        color1: '#2287e3',
        color2: '#CFCFCF',
        color3: '#CFCFCF',
      }),
      //读出待接单
      that.getUnaccepted()
  },
  //读出该维修人员的已接单待完成记录
  getUnfinished() {
    var that = this
    var id = that.data.id
    console.log('id', id)
    wx.request({
      url: `${config.host}/repairUnfinished`,
      data: {
        userid: id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res);
        if (res.data.status == 'false') {

        } else {
          that.setData({
            repairlistunfinish: res.data.data
          })
          console.log("success load");
        }
      },
      fail: function(res) {
        console.log(res);
        console.log("error!");
      },
    })
  },
  change2: function(e) {
    var that = this
    this.setData({
        change: 2,
        color2: '#2287e3',
        color1: '#CFCFCF',
        color3: '#CFCFCF',
      }),
      that.getUnfinished()
  },
  // change3: function(e) {
  //   var that = this
  //   this.setData({
  //       change: 3,
  //       color3: '#2287e3',
  //       color1: '#CFCFCF',
  //       color2: '#CFCFCF',
  //     }),
  //     //读出已完成
  //     console.log(that.data.id)
  //   setTimeout(function() {
  //     wx.request({
  //       url: `${config.service.host}/weapp/rrepairsheet`,
  //       data: {
  //         workmanid: that.data.id
  //       },
  //       method: 'Get',
  //       header: {
  //         'content-type': 'application/json' // 默认值
  //       },
  //       success: function(res) {
  //         console.log(res.data);
  //         if (res.data == '') {
  //           console.log("no data!");
  //           that.setData({
  //             repairlistfinished: []
  //           })
  //         } else {
  //           that.setData({
  //             repairlistfinished: res.data
  //           })
  //           console.log("success load");
  //         }
  //       },
  //       fail: function(res) {
  //         console.log(res);
  //         console.log("error!");
  //       },
  //     })
  //   }, 200);
  // },


  //agree 接单
  agree: function(e) {
    var that = this
    console.log(e.currentTarget.dataset.item)
    var item = e.currentTarget.dataset.item
    var dataset = e.target.dataset
    console.log("dataset:", dataset)
    var id = dataset.index
    console.log("id:", id)
    var tableid = item.tableid
    console.log(tableid)
    var email = item.userformid1
    var rlist = that.data.repairlist
    console.log("rlist1:", rlist)

    wx.showLoading({
      title: '正在接单'
    })
    wx.request({
      url: `${config.host}/repairAccept`,
      data: {
        tableid: tableid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        console.log(res)
        if (res.data.status == "false") {
          wx.showToast({
            title: '网络异常，请重试',
          })
        } else {
          rlist.splice(id, 1)
          that.setData({
            repairlist: rlist
          })
        }
      },
      fail: function() {
        // fail
        console.log("error")
      },
      complete: function(res) {
        // complete
        console.log("调用完成");
        console.log(res.data);
        wx.hideLoading()
      }
    })
  },
  //refuse
  refuse: function(e) {
    var that = this
    console.log(e.currentTarget.dataset.item)
    var item = e.currentTarget.dataset.item
    var tableid = item.tableid
    console.log(tableid)
    var dataset = e.target.dataset
    console.log("dataset:", dataset)
    var id = dataset.index
    console.log("id:", id)
    var rlist = that.data.repairlist
    console.log("rlist1:", rlist)
    rlist.splice(id, 1)
    
    //需要额外提醒管理人员维修人员拒绝维修，需要立刻重新处理----
    //需要
    wx.showModal({
      title: '提示',
      content: '确认拒绝接单？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.request({
            url: `${config.host}/repairRefuse`,
            data: {
              tableid: tableid
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            complete() {
              wx.hideLoading()
            },
            success: function(res) {
              console.log(res)
              if (res.data.status == "false") {
                wx.showToast({
                  title: '网络异常，请重试',
                })
              } else {
                that.setData({
                  repairlist: rlist
                })
                //读出待接单
                // that.getUnaccepted()
              }
            },
            fail: function() {
              // fail
              console.log("error")
            },
            complete: function(res) {
              // complete
              console.log("调用完成");
              console.log(res.data);

            }
          })
        }else{

        }
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  lower: function() {},


  inputcomment: function(e) {
    wx.setStorageSync('inputcomment', e.detail.value)
  },
  //agree
  adddiscription: function(e) {
    var that = this
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
    this.setData({
      item: e.currentTarget.dataset.item
    })
    console.log(e.currentTarget.dataset.item)
    wx.setStorageSync('currrentitem', e.currentTarget.dataset.item)
  },
  //维修失败
  cancel: function(e) {
    var that = this
    var flag = 0;
    this.setData({
      hiddenmodalput: true
    });
    var comment = wx.getStorageSync('inputcomment')
    if (comment == null || comment == '')
      comment = '维修员无留言';
    console.log("comment:", comment);
    var currentitem = wx.getStorageSync('currrentitem')

    var dataset = e.target.dataset
    console.log("dataset:", dataset)
    var id = dataset.index
    console.log("id:", id)

    wx.showModal({
      title: '提示',
      content: '未完成，确认提交维修单？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //-----此人维修结束，但是未维修成功，处理数据库信息-----
          console.log('comment', comment)
          console.log(currentitem)
          ////var tableid = this.item.tableid
          wx.request({
            url: `${config.host}/repairfail`,
            data: {
              tableid: currentitem.tableid,
              comment: comment
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              console.log(res)
              if (res.data.status == 'false') {} else if (res.data.status == "true") {
                //删掉屏幕上的此item
                var rlist = that.data.repairlistunfinish
                console.log("rlist1:", rlist)
                rlist.splice(id, 1)
                that.setData({
                  repairlistunfinish: rlist
                })
                //删除结束------------------------------
                util.showSuccess('提交成功');
              }
            }
          })
          //-----此workman维修单处理完毕---------
        } else {

        }
      }
    })
  },
  confirm: function(e) {
    var that = this
    // console.log(this.item)
    var comment = wx.getStorageSync('inputcomment')
    var currentitem = wx.getStorageSync('currrentitem')
    var email = currentitem.userformid1
    console.log(email)
    console.log(comment)
    console.log(currentitem)

    var dataset = e.target.dataset
    console.log("dataset:", dataset)
    var id = dataset.index
    console.log("id:", id)

    ////var tableid = this.item.tableid
    wx.showModal({
      title: '提示',
      content: '确认已完成维修？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: `${config.host}/repairsuccess`,
            data: {
              tableid: currentitem.tableid,
              comment: comment
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              if (res.data.status == "false") {

              } else if (res.data.status == "true") {
                //删掉屏幕上的此item
                var rlist = that.data.repairlistunfinish
                console.log("rlist1:", rlist)
                rlist.splice(id, 1)
                that.setData({
                  repairlistunfinish: rlist
                })
                //删除结束------------------------------
                util.showSuccess('提交成功');
                console.log(res.data)
              }
              // var manageid = wx.getStorageSync('currrentitem').manageid
              // var workmanid = wx.getStorageSync('info').id
              //send email
              // wx.request({
              //   url: `${config.service.host}/weapp/sendMail`,
              //   data: {
              //     email: email,
              //     text: "您的报修单已经维修成功。如有问题请致电网络中心。"
              //   },
              //   method: 'POST',
              //   header: {
              //     'content-type': 'application/x-www-form-urlencoded' // 默认值
              //   },
              //   success: function(res) {
              //     if (res.data == '') {
              //       console.log("no data!");

              //     } else {
              //       console.log("success!");
              //     }
              //   },
              //   fail: function(res) {
              //     console.log("error!");
              //     // util.showModel('访问网络失败，请检查网络');
              //   },
              // })
              //send mail over

            },
            fail: function() {
              // fail
              console.log("error")
            },
            complete: function(res) {
              // complete
              console.log("调用完成");
              console.log(res.data);
            }
          })
        } else {

        }
      }
    })

    this.setData({
      hiddenmodalput: true
    });
    // wx.request({
    //   url: `${config.service.host}/weapp/rrepairsheetunfinish`,
    //   data: {
    //     workmanid: that.data.id
    //   },
    //   method: 'Get',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function(res) {
    //     console.log(res.data);
    //     if (res.data == '') {
    //       console.log("no data!");
    //     } else {
    //       that.setData({
    //         repairlistunfinish: res.data
    //       })
    //       console.log("success load");
    //     }
    //   },
    //   fail: function(res) {
    //     console.log(res);
    //     console.log("error!");
    //   },
    // })
  },
})