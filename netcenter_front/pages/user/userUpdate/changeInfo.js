// pages/Other/changeInfo.js
var config = require('../../../config')
var util = require('../../../utils/util.js')

const app = getApp()
var openid = ''
var email = null,id=null,name=null
var info = []
var info1 = {}

Page({
  data:{
    email:'',
    name:'',
    id:''
  },

  //获取用户输入的电子邮箱地址
  email: function (e) {
    email = e.detail.value;
    console.log("email", email);
    let that = this
    //let email = e.detail.value // 获取输入框的数据
    that.setData({
      email: email
    })
  },
  // 获取用户输入的学号
  id: function (e) {
    id = e.detail.value;
    console.log("id", id);
  },
  // 获取用户输入的手机号
  name: function (e) {
    name = e.detail.value;
    console.log("name", name);
  },
  formsubmit: function (e) {
    var that=this
    var tableid = wx.getStorageSync('info').tableid
    //向服务器发送请求绑定
    // setTimeout(function () {
    console.log('email', email)
    console.log('tableid', tableid)
    if (email == '' || email == null||id==''||id==null||name==null||name=='') {
      util.showModel('提交失败', '请输入完整信息');
    } 
    // else if (phone == '' || phone == null) {
    //   util.showModel('提交失败', '请输入手机号');
    // }
    else {
      wx.request({
        url: `${config.host}/userUpdate`,
        data: {
          tableid: tableid,
          email: email,
          name:name,
          id:id
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            util.showSuccess('修改成功');
            that.onLoad()
          }else{
            util.showModel('修改失败','服务器未知错误');
          }        
        },
        fail: function () {
          // fail
          console.log("error")
        },
        complete: function (res) {
          // complete
          console.log("调用完成");
          console.log(res.data);
        }
      })
    };
  },
  //加载函数，从数据库通过openid查找有没有该学号，如果有返回mainviewA
  onLoad: function () {
    var that = this
    //获取info
    var infoid = wx.getStorageSync('openid')
    wx.request({
      url: `${config.host}/userCheck`,
      data: {
        openid: infoid
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        if (res.data.status=='false') {
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
          wx.showModal({
            title: '未绑定',
            content: '请绑定学工号',
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../userInfo/BindForm',
                })
              }else{
                
              }
            }
          })
          //util.showModel{('账号未绑定', '请绑定学工号',)};
          
        } else {
          //util.showSuccess('获取信息成功');
          that.setData({
            info1: res.data,
            email: res.data.email,
            id: res.data.id,
            name: res.data.name
          })
          email = res.data.email
            id = res.data.id
            console.log(id)
          name = res.data.name
          wx.setStorage({
            key: 'info',
            data: that.data.info1,
          })
        }
      },
      fail: function (res) {
        // console.log("error!");
        //util.showSuccess('请绑定学工号');
      },
    })
    // }, 80);
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
  },
})