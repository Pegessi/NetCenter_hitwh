// pages/personalmanage/workmanDelete/index.js
var config = require('../../../config')
var util = require('../../../utils/util.js')
var identical
const app = getApp();
var datas = {
  id: '',
};

Page({
  data: datas,
  onLoad: function(options) {},
  //获取详细信息
  Identical: function(e) {
    this.setData({
      id: e.detail.value
    })
    console.log(this.data.id)
  },
  workmanDelete(id) {

    var identity = wx.getStorageInfoSync('info').identity
    console.log(identity)
    wx.showLoading({
      title: '删除中'
    })
    var that = this
    console.log(id)
    wx.request({
      url: `${config.host}/workmanDelete`,
      data: {
        id: id,
        // 身份验证
        identity: identity
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function(res) {
        console.log(res)
        if (res.data.status == '001' || res.data.status == '004') {
          console.log("no data!");
          wx.showModal({
            title: '删除失败',
            content: '请稍后重试',
          })
          // util.showModel('该维修人员不存在');
          // util.showModel('学工号不存在');
        } else if (res.data.status == '002') {
          wx.showModal({
            title: '删除失败',
            content: '无权限',
          })
        } else if (res.data.status == '003') {
          wx.showModal({
            title: '删除失败',
            content: '数据库错误',
          })
        }else if (res.data.status == '100'){
          console.log("success!");
          that.setData({
            id: ''
          })
          util.showSuccess('删除成功');
        }
      },
      fail: function(res) {
        console.log("error!");
        // util.showModel('访问网络失败，请检查网络');
      },
    })
  },

  formSubmit: function(e) { //提交数据
    var that = this
    var id = this.data.id;
    console.log('id', id)
    var identity=wx.getStorageInfoSync('info').identity
    console.log(identity)
    // wx.request({
    //   url: `${config.host}/workmanCheck`,
    //   data: {
    //     id: id,
    //     // 用户身份
    //     identity:identity
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function(res) {
    //     console.log(res)
    //     //返回信息为空则不是管理员
    //     if (res.data.status == 'false') {
    //       wx.showModal({
    //         title: '添加失败',
    //         content: '该人员未注册',
    //       })
    //     } else if (res.data.identity == '2') { //否则即为维修人员
    //       console.log("res data", res.data);
    //       // console.log('email:', res.data[0].email)
    //       that.workmanDelete(id)
    //     } else {
    //       wx.showModal({
    //         title: '添加失败',
    //         content: '该人员不是维修人员',
    //       })

    //     }
    //   },
    //   fail: function(res) {
    //     console.log("check existence error!");
    //   },
    // })
    var id = this.data.id;
    console.log(this.data.id)


  },

})