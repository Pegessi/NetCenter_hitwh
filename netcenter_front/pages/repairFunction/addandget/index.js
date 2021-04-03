// pages/repairFunction/addandget/index.js
const app = getApp()
const {
  $Message,
  $Toast
} = require('../../component/iview-ui/base/index.js');
//
const template1 = 'PKc4jdZuGZizOE0MdVyG4NdO349bl-E2Q1Hg8MbQE40'
var config = require('../../../config')
var util = require('../../../utils/util.js')
var formId = 'unfinish';
var tableid = '';
Page({
  /**
   * 页面的初始数据
   * menu--弹出菜单的json数组 menuType--区分输入框的参数 errorType--故障类型字段
   * areaType--所在区域字段 dpartType--故障公寓字段 roomStr--故障房间
   * phoneStr--联系方式 show--选择框显示的布尔值 tabFlag--页面切换布尔值
   * errorTypePlus--管理员故障类型
   */
  data: {
    repairlist: {},
    menu: [],
    menuType: '',
    identity: '',
    errorType: [{
        'name': '无线网信号问题',
        'value': '1'
      },
      {
        'name': '路由器问题'
      },
      {
        'name': '无法上网'
      },
      {
        'name': '端口线材损坏'
      },
      {
        'name': '客户端无法认证'
      },
      {
        'name': '业务咨询'
      },
      {
        'name': '其他'
      },
    ],
    errorTypePlus: [{
        'name': '无线网信号问题'
      },
      {
        'name': '路由器问题'
      },
      {
        'name': '无法上网'
      },
      {
        'name': '端口线材损坏'
      },
      {
        'name': '客户端无法认证'
      },
      {
        'name': '业务咨询'
      },
      {
        'name': '视频直播架设'
      },
      {
        'name': '交换机更换'
      },
      {
        'name': '路由器设置'
      },
      {
        'name': '水晶头、模糊更换'
      },
      {
        'name': '线路查找'
      },
      {
        'name': '布线'
      },
      {
        'name': '其他'
      },
    ],
    areaType: [{
        'name': '学生公寓区'
      },
      {
        'name': '教学楼区'
      },
      {
        'name': '教师办公区'
      },
      {
        'name': '家属区'
      },
      {
        'name': '其他区域'
      }
    ],
    stuDpartType: [{
        'name': '一公寓'
      },
      {
        'name': '二公寓'
      },
      {
        'name': '三公寓'
      },
      {
        'name': '四公寓'
      },
      {
        'name': '五公寓'
      },
      {
        'name': '六公寓'
      },
      {
        'name': '七公寓'
      },
      {
        'name': '八公寓'
      },
      {
        'name': '九公寓'
      },
      {
        'name': '十公寓'
      },
      {
        'name': '十一公寓'
      },
      {
        'name': '十二公寓'
      }
    ],
    teaDpartType: [{
        'name': 'A楼'
      },
      {
        'name': 'B楼'
      },
      {
        'name': 'G楼'
      },
      {
        'name': 'H楼'
      },
      {
        'name': 'M楼'
      },
      {
        'name': 'N楼'
      },
    ],
    teacherDpartType: [{
        'name': 'H楼'
      },
      {
        'name': '宋健1号楼'
      },
      {
        'name': '宋健2号楼'
      },
    ],
    homeDpartType: [{
        'name': '后山区域'
      },
      {
        'name': '高层区域'
      },
      {
        'name': '多层区域'
      }
    ],
    otherAreaType:[
      {'name': '创新创业园区'},
      {'name':'大学生活动中心'},
      {'name':'大学生服务中心'}
    ],
    defaultDpartType: [{
      'name': '请先选择区域'
    }],
    errorStr: '',
    areaStr: '',
    dpartStr: '',
    roomStr: '',
    phoneStr: '',
    show: false,
    isNull: true
  },
  getID: function (e) {
    getID = e.detail.value;
  },
  onPullDownRefresh: function () {
    // var that = this
    // var t1 = Date.now();
    // that.setData({
    //   current: t1
    // })
    this.onShow();
    wx.stopPullDownRefresh();
  },

  // 弹出选择菜单函数 通过绑定不同输入框事件参数id来进行数据和更新
  menuList(e) {
    var type = e.currentTarget.dataset.id
    var identity = wx.getStorageSync('identity')
    let data = null
    switch (type) {
      case "1":
        data = this.data.errorType
        if (identity == 1 || 2) {
          data = this.data.errorTypePlus
        }
        break
      case "2":
        data = this.data.areaType
        break
      case "3":
        if (this.data.areaStr == '学生公寓区') {
          data = this.data.stuDpartType
        } else if (this.data.areaStr == '教学楼区') {
          data = this.data.teaDpartType
        } else if (this.data.areaStr == '教师办公区') {
          data = this.data.teacherDpartType
        } else if (this.data.areaStr == '家属区') {
          data = this.data.homeDpartType
        } else if (this.data.areaStr == '其他区域') {
          data = this.data.otherAreaType
        } else {
          data = this.data.defaultDpartType
        }
        break
      default:
        break
    }
    this.setData({
      show: true,
      menu: data,
      menuType: type
    })
  },

  // 录入房间号
  onChangeRoom: function (e) {
    var tmp = e.detail
    this.setData({
      roomStr: tmp
    })
  },

  // 录入联系方式
  onChangePhone: function (e) {
    var tmp = e.detail
    this.setData({
      phoneStr: tmp
    })
  },

  // 选择框关闭函数
  onClose() {
    this.setData({
      show: false
    });
  },

  // 选择框选择选项函数
  onSelect(event) {
    // 通过menuType区分输入框
    // event.detail返回该选项的字典 包括所有字段 name为规定的显示字段
    var type = this.data.menuType
    switch (type) {
      case "1":
        this.setData({
          errorStr: event.detail.name
        })
        break
      case "2":
        this.setData({
          areaStr: event.detail.name
        })
        break
      case "3":
        this.setData({
          dpartStr: event.detail.name
        })
        break
      default:
        break
    }
  },

  /**
   * 生命周期函数 加载时
   */
  onLoad: function () {
    var that = this;
    //调用存储在本地的学号信息
    that.setData({
      info: wx.getStorageSync('info')
    })
  },


  // 实际添加表单的函数
  repairAdd: function () {
    var that = this
    console.log('phone', that.data.phoneStr)
    console.log('roomnumber', that.data.roomStr)
    console.log('repairtype', that.data.errorStr)
    console.log('repairlocation', that.data.areaStr)
    console.log('repairapartment', that.data.dpartStr)
    // if (wrongtype == undefined || wrongtype == null || wrongtype == '') {
    //   wrongtype = '路由器'
    // }
    wx.showLoading({
      title: '正在添加'
    })
    wx.request({
      url: `${config.host}/repairAdd`,
      data: {
        submitid: wx.getStorageSync('info').id,
        repairlocation: that.data.areaStr,
        repairapartment: that.data.dpartStr,
        repairroom: that.data.roomStr,
        repairdescription: that.data.errorStr + '出现问题',
        repaircontact: that.data.phoneStr,
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
      success: function (res) {
        console.log(res.data)
        tableid = res.data[0]
        if (res.data.status == 'true') {
          //清空输入框
          that.sendMessage();
          that.setData({
            areaStr: '',
            dpartStr: '',
            errorStr: '',
            roomStr: '',
            phoneStr: '',
          })
          util.showSuccess('报修成功');
        } else {
          $Toast({
            content: '发布失败'
          });
        }
        that.setData({
          buttonflag: false
        })
      },
      fail: function (res) {
        console.log('fail', res)
        that.setData({
          buttonflag: false
        })
      },
      complete: function () {
        wx.hideLoading()
      },
    })
  },
  // 发送报修信息 订阅信息 即可以回复提示用户的订阅消息
  sendMessage: function (e) {
    console.log('subscribe')
    var that = this
    var formdata = {
      // 故障地址
      thing1: {
        value: that.data.areaStr + that.data.dpartStr + that.data.roomStr
      },
      // 故障描述/错误类型
      thing2: {
        value: that.data.errorStr
      },
      // 报修状态
      phrase3: {
        value: '未处理'
      },
      // 联系电话
      phone_number4: {
        value: that.data.phoneStr
      },
      // 报修时间
      date5: {
        value: util.formatTime(new Date())
      },
    }
    wx.cloud.callFunction({
        name: 'subscribe',
        data: {
          data: formdata,
          templateId: template1,
        }
      })
      .then(() => {
        wx.showToast({
          title: '订阅成功',
          icon: 'success',
          duration: 2000,
        });
      }).catch(() => {
        wx.showToast({
          title: '订阅失败',
          icon: 'success',
          duration: 2000,
        })
      });
  },
  // 提交函数
  onSubscribe: function (e) {
    formId = e.detail.formId
    var that = this;
    console.log('e', e)
    console.log('info', that.data.info);
    wx.requestSubscribeMessage({
      tmplIds: [template1],
      success(res) {
        if (res.errMsg === 'requestSubscribeMessage:ok') {
          {
            console.log('ok')
            that.onSubmit(formId);
          }
        };
      }
    })
  },
  // 提交查验
  onSubmit: function (formId) {
    // formId = e.detail.formId //获取formid
    var that = this;
    var formId = formId
    console.log(that.data.info)
    if (that.data.info.id == null || that.data.info.id == undefined) {
      wx.showModal({
        title: '提示',
        content: '请先登陆/绑定哦',
      })
    } else if (that.data.phoneStr == '' || that.data.roomStr == '' || that.data.errorStr == '' || that.data.areaStr == '' || that.data.dpartStr == '') {
      wx.showModal({
        title: '提示',
        content: '请输入完整的报修单信息',
      })
    } else {
      that.repairAdd(formId)
      that.setData({
        buttonflag: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    formId = null
    this.setData({
      change: 1,
      color1: '#2287e3',
      color2: '#CFCFCF'
    })

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    var t1 = Date.now();
    that.setData({
      current: t1
    })
    this.onShow();
    wx.stopPullDownRefresh();
  },

  // 页面切换-快速报修
  change1: function (e) {
    this.setData({
      change: 1,
      color1: '#2287e3',
      color2: '#CFCFCF',
    })
  },

  // 页面切换-我的报修
  change2: function (e) {
    util.showBusy('加载中')
    this.setData({
      change: 2,
      color2: '#2287e3',
      color1: '#CFCFCF'
    })
    var that = this
    var specialid = wx.getStorageSync('info').id
    console.log(specialid)
    //读出该用户提交的所有维修记录
    that.repairGetByUser(specialid)
  },

  // 获取用户提交订单
  repairGetByUser(tableid) {
    var that = this
    wx.showLoading({
      title: '正在获取信息'
    })
    console.log(tableid)
    wx.request({
      url: `${config.host}/repairGetByUser`,
      data: {
        userid: tableid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 'false') {
          console.log("no data!");
        } else {
          if (res.data.data.length != 0) {
            that.setData({
              isNull: false,
              repairlist: res.data.data
            })
          } else {
            that.setData({
              isNull: true
            })
          }
          console.log("success load");
        }
      },
      fail: function (res) {
        console.log("error!", res)
      },
    })
  },


  // 删除报修单
  repairDelete(tableid, id) {
    var that = this

    var identity = wx.getStorageSync('info').identity
    console.log(identity)
    wx.showLoading({
      title: '正在删除'
    })
    wx.request({
      url: `${config.host}/repairDelete`,
      data: {
        tableid: tableid,
        identity: identity
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == '001' || res.data.status == '004') {
          console.log("no data!");
          wx.showToast({
            title: '删除失败',
          })
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
        } else if (res.data.status == '100') {
          console.log("success!");
          wx.showToast({
            title: '删除成功',
          })
          var rlist = that.data.repairlist
          console.log("rlist1:", rlist)
          rlist.splice(id, 1)
          that.setData({
            repairlist: rlist
          })
        }
      },
      fail: function (res) {
        console.log("error!");
        // util.showModel('访问网络失败，请检查网络');
      },
    })
  },

})