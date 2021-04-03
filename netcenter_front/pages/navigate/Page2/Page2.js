// pages/MainInterface/MainviewA.js
var change = 1; //change用来控制显示报修页面 or 显示已报修页面
var color1, color2, color3; //选中或者不选中的颜色
const app = getApp()
const {
  $Message,
  $Toast
} = require('../../component/iview-ui/base/index.js');
var info = {}
var code = null
var openid = null
var phonenumber = '',
  wrongtype = '路由器';
var department; //description;
var repairlocation = '学生公寓区',
  repairapartment = '一公寓',
  repairroom = '',
  temp8;
var config = require('../../../config')
var util = require('../../../utils/util.js')
var allInfo = [];
var managerOpenid;
var submitFlag = false
var info1 = {};
var touser1;
var formId = 'unfinish';
var formId1
var tableid;
var clientHeight;
var system;
var flagofSubmit = true;
var overflow;
var flag = 1;
var bOneOver = false;
var oProblemList = {};
var aListKeys = [];
var dic = {}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topicid: [],
    info: {},

    id: '',
    num: '',
    change: 1,
    room: '',
    array1: ['无线网信号问题','路由器', '无法上网', '端口线材损坏', '客户端无法认证', '业务咨询', '其他'],
    array2: ['学生公寓区', '教学楼区', '教师办公区'],
    focus: false,
    inputValue: '',
    areas: [],
    objectArray: [{
        area: "学生公寓区",
        id: 0,
        array: ["一公寓", '二公寓', '三公寓', '四公寓', '五公寓', '六公寓', '七公寓', '八公寓', '九公寓', '十公寓', '十一公寓', '十二公寓'],
      },
      {
        area: "教学楼区",
        id: 1,
        array: ['A楼', 'B楼', 'G楼', 'H楼', 'M楼', 'N楼']
      },
      {
        area: "教师办公区",
        id: 2,
        array: ['H楼', '宋健1号楼', '宋健2号楼']
      }
    ],
    manageList1: [{
        name: '报修管理',
        url: '/pages/repairFunction/managerepair/index',
        picsrc: '/icon/baoxiu.png'
      },
      {
        name: '人员管理',
        url: '../../personalmanage/getAll/index',
        picsrc: '/icon/yewu.png'
      },
      {
        name: '事务增删',
        url: '../../centerOperation/manageAll/index',
        picsrc: '/icon/centerService.png'
      }
    ],
    manageList2: [{
        name: '网络报修',
        url: '/pages/repairFunction/addandget/index',
        picsrc: '/icon/zhinan.png'
      },
      {
        name: '问题指南',
        url: '../../questionFunction/getAll/index',
        picsrc: '/icon/ssearch.png'
      },
      {
        name: '指南管理',
        url: '../../questionFunction/manageAll/index',
        picsrc: '/icon/add.png'
      }
    ],

    workList: [{
        name: '报修处理',
        url: '/pages/repairFunction/workrepair/index',
        picsrc: '/icon/baoxiu.png'
      },
      {
        name: '问题指南',
        url: '../../questionFunction/getAll/index',
        picsrc: '/icon/zhinan.png'
      },
      {
        name: '中心事务',
        url: '../../centerOperation/getAll/index',
        picsrc: '/icon/centerService.png'
      }
    ],

    commenList: [{
      name: '中心事务',
      url: '../../centerOperation/getAll/index',
      picsrc: '/icon/centerService.png'
    }, {
      name: '问题指南',
      url: '../../questionFunction/getAll/index',
      picsrc: '/icon/zhinan.png'
    }, {
      name: '失卡招领',
      url: '/pages/lostcard/getAll/index',
      picsrc: '/icon/ssearch.png'
    }, {
      name: '网络报修',
      url: '/pages/repairFunction/addandget/index',
      picsrc: '/icon/baoxiu.png'
    }],
    object: [],
    areaindex: 0,
    index1: 0,
    buttonflag:false,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    imgList: [],
    noticeList: [],
    // 轮播图参数
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },
  // 公告跳转函数-只能通过静态页面/将配置文件放在校园网服务器上
  routeWebView: function (params) {
    console.log(params.target.dataset.link)
    wx.setStorageSync('src', params.target.dataset.link)
    wx.navigateTo({
      url: '/pages/webViewEntry/index',
    })
  },
  // 官网跳转函数
  routeOfficial: function () {
    wx.setStorageSync('src', 'https://www.hitwh.edu.cn/')
    wx.navigateTo({
      url: '/pages/webViewEntry/index',
    })
  },
  // 跳转推送
  routeArticle: function (params) {
    console.log(params.target.dataset.link)
    wx.setStorageSync('src', params.target.dataset.link)
    wx.navigateTo({
      url: '/pages/webViewEntry/index',
    })
  },
  // 获取推送信息
  getPush: function(){
    var that = this
    wx.request({
      url: `${config.host}/getPush`,
      method: 'GET',
      success: function(res){
        console.log(res)
        that.setData({imgList: res.data})
      }
    })
  },
  // 轮播导航栏触发
  scroll(e) {
    console.log(e)
  },
  change1: function(e) {
    this.setData({
      change: 1,
      color1: '#2287e3',
      color2: '#CFCFCF',
      color3: '#CFCFCF',
    })
    this.onShow();
  },

  change2: function(e) {
    var that = this
    this.setData({
      change: 2,
      color2: '#2287e3',
      color1: '#CFCFCF',
      color3: '#CFCFCF',
    })
  },

  change3: function(e) {
    var that = this
    this.setData({
      change: 3,
      color3: '#2287e3',
      color1: '#CFCFCF',
      color2: '#CFCFCF',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //调用存储在本地的学号信息
    that.setData({
      info: wx.getStorageSync('info')
    })
    that.setData({
      wrongtype: 0,
      buttonflag:false
    })
    
    flag = 1;
    flagofSubmit = true;
    that.setData({
      overflow: false
    })
    var objectArray = this.data.objectArray
    var areas = []
    for (var i = 0; i < objectArray.length; i++) {
      areas.push(objectArray[i].area, )
    }
    this.setData({
      areas: areas,
      object: objectArray[this.data.areaindex].array
    })

    // 等待请求校网通知参数
    var self = this
    // 接受校网通知
    wx.request({
      url: `${config.host}/getNotice`,
      method: 'GET',
      success: function (res) {
        console.log(res)
        self.setData({
          noticeList: res.data
        })
      }
    })
    // 获取推送
    self.getPush()
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
    var that = this;
    //获取所有帖子
    //that.getTopic()
    //调用存储在本地的学号信息
    info = wx.getStorageSync('info')
    that.setData({
      info: wx.getStorageSync('info')
    })
    formId = null
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  getID: function(e) {
    getID = e.detail.value;
    // console.log(getID);
  },

  //错误类型
  WrongType: function(e) {
    // console.log('picker1发送选择改变，携带值为', e.detail.value)
    this.setData({
      wrongtype: e.detail.value
    })
    var wrongType
    if (e.detail.value == 0) {
      wrongType = '路由器'
    } else if (e.detail.value == 1) {
      wrongType = '无法上网'
    } else if (e.detail.value == 2) {
      wrongType = '端口线材损坏'
    } else if (e.detail.value == 3) {
      wrongType = '客户端无法认证'
    } else if (e.detail.value == 4) {
      wrongType = '业务咨询'
    } else if (e.detail.value == 5) {
      wrongType = '其他'
    }
    wrongtype = wrongType
    console.log('wrongtype', wrongType)
  },

  //故障区域
  Area: function(e) {
    var wrongArea = '学生公寓区'
    // console.log('picker2发送选择改变，携带值为', e.detail.value)
    if (e.detail.value == 0) {
      wrongArea = '学生公寓区'
      repairapartment = '一公寓'
    } else if (e.detail.value == 1) {
      wrongArea = '教学楼区'
      repairapartment = 'A楼'
    } else if (e.detail.value == 2) {
      wrongArea = '教师办公区'
      repairapartment = 'H楼'
    }
    this.setData({
      areaindex: e.detail.value,
      index1: 0
    })
    var objectArray = this.data.objectArray
    this.setData({
      object: objectArray[this.data.areaindex].array
    })
    repairlocation = wrongArea
  },
  //故障楼名
  Department: function(e) {
    this.setData({
      index1: e.detail.value
    })
    var areaIndex = this.data.areaindex
    var area = this.data.objectArray[areaIndex]
    var wrongBuild = area.array[e.detail.value]
    repairapartment = wrongBuild
    console.log('wrongBuild', repairapartment)
  },
  //故障房间
  RoomNumber: function(e) {
    // console.log('故障房间', e.detail.value)
    repairroom = e.detail.value
  },
  //联系方式
  PhoneNumber: function(e) {
    phonenumber = e.detail.value;
  },

  repairAdd: function(formId) {
    var that = this
    that.setData({
      buttonflag:true
    })
    console.log('phone', phonenumber)
    console.log('roomnumber', repairroom)
    console.log('repairtype', wrongtype)
    console.log('repairlocation', repairlocation)
    console.log('repairapartment', repairapartment)
    if (wrongtype == undefined || wrongtype == null || wrongtype == '') {
      wrongtype = '路由器'
    }
    wx.request({
      url: `${config.host}/repairAdd`,
      data: {
        submitid: wx.getStorageSync('info').id,
        repairlocation: repairlocation,
        repairapartment: repairapartment,
        repairroom: repairroom,
        repairdescription: wrongtype + '出现问题',
        repaircontact: phonenumber,
        previousid: null,
        username: wx.getStorageSync('info').name,
        repairstatus: '待处理',
        failsolution: null
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        tableid = res.data[0]

        if(res.data.status==false){

          $Toast({
            content: '发布失败'
          });
        }else{
          //清空输入框
          that.setData({
            index1: 0
          })
          that.setData({
            room: ''
          })
          that.setData({
            num: ''
          })
          util.showSuccess('报修成功');
          that.sendFunction(formId)
        }

        that.setData({
          buttonflag: false
        })
      },
      fail: function() {
        console.log("fail")

        that.setData({
          buttonflag: true
        })
      },
      complete: function(res) {
        console.log(res.data)
      }
    })
  },

  sendFunction: function(formid) {
    var accesskey = ''

    //定时获取access_token,即发送模板消息的凭证，需要用AppID和AppAecret调用接口获取
    wx.request({
      //参数说明：grant_type 获取access_token填写client_credential 
      //         appid 第三方用户唯一凭证
      //         secret 第三方用户唯一凭证密钥，即appsecret
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx3f8c6af392a76209&secret=0fe5d68bef929711ee76948335af89e0',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data);
        accesskey = res.data.access_token
        //发送模板消息
        var touserid = wx.getStorageSync('openid')

        // setTimeout(function () {
        console.log(touserid)
        console.log("accesskey" + accesskey)
        var mydate = new Date();
        console.log('mydate', mydate);
        var month = mydate.getMonth()
        month = month + 1
        var date = mydate.getFullYear() + '年' + month + '月' + mydate.getDate() + '日' + mydate.getHours() + '点' + mydate.getMinutes() + '分'
        console.log('date', date)
        wx.request({
          url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + accesskey,
          method: 'POST',
          data: {
            //参数说明：touser 接收者（用户）的openid
            //         template_id  所需下发的模板消息的id
            //         form_id 表单提交场景下，为submit事件带上的formid，支付场景下，为本次支付的prepay_id
            //         data  模板内容，不填则下发空模板
            'touser': touserid,
            'template_id': 'hwmAtoVuKCx-PEwe1eM_O-veoGsb2e0PM8fgZHQljq0', //'hwmAtoVuKCx-PEwe1eM_OxDkS_WM3MxGkDxKXDucjfU',
            'form_id': formid,
            'data': {
              "keyword1": {
                "value": repairapartment + '-' + repairroom //tableid
              },
              "keyword2": {
                "value": wrongtype + '出现问题'
              },
              "keyword3": {
                "value": '待处理'
              },
              "keyword4": {
                "value": phonenumber
              },
              "keyword5": {
                "value": date
              }
            }
          },
          success: function(res) {
            console.log('成功发送', res.data);
            phonenumber = ''

          },
          fail: function(res) {
            console.log('fail' + res.data);
          },
        })
      },
      fail: function(res) {
        console.log("error!");
      },
    })
  },

  formsubmit: function(e) {
    formId = e.detail.formId //获取formid
    

    var that = this;
    console.log(that.data.info)
    if (that.data.info.id == null || that.data.info.id == undefined) {
      wx.showModal({
        title: '提示',
        content: '请先登陆/绑定哦',
      })
    } else if (phonenumber == null || phonenumber == "" || repairroom == null || repairroom == "") {
      wx.showModal({
        title: '提示',
        content: '请输入完整的报修单信息',
      })
    } else {
      that.repairAdd(formId)
    }

    // {"email":"1040056148@qq.com","id":"66","identical":"3","name":"完颜馨叶","openid":"ocw7r4onhM-sYuaobIqfrMqtboHQ","tableid":1}
    // if (submitFlag == true) { // && formId == 'finish'&& submitFlag1 == 'false'
    //   console.log("formId=", formId);
    //   console.log("此时进入submit==true条件submitFlag=", submitFlag);
    //   var email = wx.getStorageSync('info').email;

    //   console.log(submitid)
    //   console.log(repairtype)
    //   console.log(repairlocation)
    //   console.log(repairapartment)
    //   console.log(repairroom)
    //   console.log(repaircontact)
    //   console.log('formid:', formId)

    // }
    // console.log("sendFlag=", sendFlag)
    //发送给用户的模板消息-----------------------------------------------------------------------------------------------
    //setTimeout(function () {
    //if (sendFlag == true) {

    //}, 2000)
  },


  // searchNavigator: function() {
  //   wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
  //     url: "/wxSearchView/wxSearchView"
  //   })
  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // Calender: function() {
  //   wx.navigateTo({
  //     url: '../FunctionPages/LifeCalender',
  //   })
  // },

  // tickets: function() {
  //   wx.navigateTo({
  //     url: '../Other/Ticket',
  //   })
  // },

  // CET: function() {
  //   wx.navigateTo({
  //     url: '../Other/CET',
  //   })
  // },

  // GPA: function() {
  //   wx.navigateTo({
  //     url: '../Other/GPA',
  //   })
  // },

  // department: function() {
  //   wx.navigateTo({
  //     url: '../Other/department',
  //   })
  // }

})