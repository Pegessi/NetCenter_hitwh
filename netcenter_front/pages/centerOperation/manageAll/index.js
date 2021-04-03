// pages/centerOperation/manageAll/index.js
var util = require('../../../utils/util.js')
var info = {}
var config = require('../../../config')
var change = 1; //change用来控制显示报修页面 or 显示已报修页面
var color1, color2; //选中或者不选中的颜色
var content = '';
const { $Toast } = require('../../component/iview-ui/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    file: {},
    fname: '',
    flink: '',
    id: '',
    value: ''
  },
  fileGetAll() {
    wx.showLoading({
      title: '正在获取信息'
    })
    var that=this
    wx.request({
      url: `${config.host}/fileGetAll`,
      data: {},
      method: 'Get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function(res) {
        console.log(res);
        if (res.data == '') {
          console.log("no data!");
        } else {
          that.setData({
            file: res.data
          })
          console.log("success load");
          console.log(that.data.file);
        }
      },
      fail: function(res) {
        console.log(res);
        // util.showModel('获取考勤信息失败', '请检查网络连接是否正常');
        console.log("error!");
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //调用存储在本地的学号信息
      that.setData({
        id: wx.getStorageSync('info').id
      })
    that.fileGetAll()

  },
  jumpweb: function(e) {
    var that = this
    var item = e.currentTarget.dataset.item;
    console.log('item:', item)
    try {
      wx.setStorageSync('downloadItem', item)
    } catch (e) {}
    wx.navigateTo({
      url: '../installFile/index',
    })
    //    var flink = e.currentTarget.dataset.flink;

  },
  //删除文件
  delfile: function(e) {
    var that=this
    console.log(e.currentTarget.dataset.item)
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var fileitem = e.currentTarget.dataset.item.tableid
    var identity = wx.getStorageSync('info').identity
    console.log(identity)
    wx.showLoading({
      title: '正在删除'
    })
    wx.request({
        url: `${config.host}/fileDelete`,
        data: {
          tableid: fileitem,
          identity: identity
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
          if (res.data.status == '100') {
            util.showSuccess('删除成功');
            console.log(res.data)
            var rlist = that.data.file
            console.log("rlist1:", rlist)
            rlist.splice( index,1)
            that.setData({
              file: rlist
            })
          } else if (res.data.status == '002' ){
            $Toast({
              content: '无权限',
              type: 'warning'
            });
          } else if (res.data.status == '001' || res.data.status == '004'){
            $Toast({
              content: '删除失败',
              type: 'warning'
            });
          } else if (res.data.status == '003') {
            $Toast({
              content: '数据库错误',
              type: 'warning'
            });
          }
        },
        fail: function() {
          // fail
          console.log("error")
          $Toast({
            content: '删除失败',
            type: 'warning'
          });
        },
        complete: function(res) {
          // complete
          console.log("调用完成");
          console.log(res.data);
          wx.hideLoading()
        }
      })

  },
  getName: function (e) {
    console.log('getName', e)
    var that=this
    that.setData({
      name: e.detail.detail.value
    })
  },
  getContent: function (e) {
    console.log('getContent', e)
    var that = this
    that.setData({
      content: e.detail.detail.value
    })
  },
  getLink: function (e) {
    console.log('link',e)
    var that = this
    that.setData({
      link: e.detail.detail.value
    })
  },
  submit: function(e) { //提交数据
    var that=this
    var fname = that.data.name;
    var flink = that.data.link;
    var content = that.data.content;
    var that = this
    if (fname == '' || fname == undefined || flink == '' || fname == undefined) {
      util.showSuccess('信息不完整');
      return
    }
    console.log('fname', fname)
    console.log('content', content)
    if(content==""||content==undefined){
      content="无"
    }
    console.log('flink',flink);
    wx.showLoading({
      title: '正在提交'
    })

    var identity = wx.getStorageSync('info').identity
    console.log(identity)
    wx.request({
      url: `${config.host}/fileAdd`,
      data: {
        fname: fname,
        flink: flink,
        content: content,
        submitid: this.data.id,
        identity: identity
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        if (res.data.status == '001' || res.data.status == '004') {
          console.log("no data!");
          $Toast({
            content: '提交失败',
            type: 'warning'
          });
        }else if (res.data.status == "100") {
          util.showSuccess('提交成功');
          console.log(res.data)
          that.setData({
            value: ''
          })
          that.fileGetAll()
          // content = ''
          // var adddata = {
          //   fname: fname,
          //   flink: flink,
          //   content: content,
          //   submitid: that.data.id
          // }
          // var rlist = that.data.file
          // console.log("rlist1:", rlist)
          // rlist.splice(-1,0,adddata)
          // that.setData({
          //   file: rlist
          // })
          
        } else if (res.data.status == '002'){
          $Toast({
            content: '无权限',
            type: 'warning'
          });
        } else if (res.data.status == '003') {
          $Toast({
            content: '数据库错误',
            type: 'warning'
          });
        } 
      },
      fail: function() {
        // fail
        console.log("error")
        $Toast({
          content: '网络故障',
          type: 'warning'
        });
      },
      complete: function(res) {
        // complete
        console.log("调用完成");
        console.log(res.data);
        wx.hideLoading()
      }
    })

  },

  onShow: function() {
    this.setData({
      change: 1,
      color1: '#2287e3',
      color2: '#CFCFCF'
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
    this.setData({
      change: 2,
      color2: '#2287e3',
      color1: '#CFCFCF',
    })
  }
})