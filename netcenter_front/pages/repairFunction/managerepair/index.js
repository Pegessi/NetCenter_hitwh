// pages/repairFunction/managerepair/index.js
const app = getApp()
var code = null
var openid = null
var config = require('../../../config')
var util = require('../../../utils/util.js')
var allInfo = [];
var managerOpenid;
var repairlistday = [],
  repairlistmonth = [],
  repairlistyear = []
var info1 = {};
var change = 1; //change用来控制显示报修页面 or 显示已报修页面
var color1, color2; //选中或者不选中的颜色
// var flag=true;
Page({

  data: {
    repairlist: {},
    unrepairlist: {},
    current: [],
    array: [{
        name: '1',
        value: '本日'
      },
      {
        name: '2',
        value: '本月'
      },
      {
        name: '3',
        value: '本年',
        checked: 'true'
      },
    ],
    repairlistyear: {},
  },

  listenerRadioGroup: function(e) {
    console.log(e.detail.value);
    if (e.detail.value == 1) {
      var that = this
      console.log('1:repairlistday', repairlistday)
      that.setData({
        repairlist: repairlistday
      })
    } else if (e.detail.value == 2) {
      var that = this
      console.log('2:repairlistmonth', repairlistmonth)
      that.setData({
        repairlist: repairlistmonth
      })
    } else if (e.detail.value == 3) {
      console.log('3:repairlistyear', repairlistyear)
      var that = this
      that.setData({
        repairlist: repairlistyear
      })
    }
    console.log('repairlist', this.data.repairlist)
  },
  getAlllist() {
    // 获取已处理的repairlist
    var originlist = this.data.repairlist //originlist: 所有已处理数据
    console.log('originlist:', originlist)
    Date.prototype.toLocaleString = function() {
      return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate() + ' ' + this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds()
    }
    var date = new Date();

    var cyear = date.getFullYear()
    var cmonth = date.getMonth() + 1
    // console.log(cmonth)
    var cday = date.getDate()
    var chour = date.getHours()
    var cminute = date.getMinutes()
    var csecond = date.getSeconds()
    //console.log(cday)
    repairlistyear = []
    repairlistmonth = []
    // var repairlistweek = []
    repairlistday = []
    var cdate = cyear + '-' + cmonth + '-' + cday + ' ' + chour + ':' + cminute + ':' + csecond //获取和数据库格式相同的当前的时间，在比较日子的时候用
    //var cday = parseInt((parseInt(cdate.replace(/[^0-9]/ig, "")) / 1000000) % 100) 
    //处理所得的日子是相同的，当具体日期是两位数的时候，会计算出正确的日期，当日子是一位数的时候计算结果是错误的，是月份加日期组成的两位数，，所以此处我们“将错就错”，这样比较得出的结果正确即可。
    console.log('cdate', cdate)
    // console.log('originlist.length:', originlist.length)
    for (var i = 0, len = originlist.length; i < len; i++) {
      var origintime = originlist[i].managedate
      console.log('origintime:', origintime)
      origintime = origintime.replace(/-/g, '/');
      var oldTime = new Date(Date.parse(origintime));
      console.log(oldTime.getFullYear())
      var year = oldTime.getFullYear()
      // console.log(oldTime.getMonth() + 1)
      var month = oldTime.getMonth() + 1
      var day = parseInt((parseInt(origintime.replace(/[^0-9]/ig, "")) / 1000000) % 100)
      console.log('current:y-m-da', cyear, cmonth, cday)
      console.log('year-month-day', year, month, day)
      if (year == cyear) {
        console.log('year=cyear')
        repairlistyear.push(originlist[i])
        console.log('year', repairlistyear)
      }
      if ((year == cyear) && (month == cmonth)) {
        console.log('month=cmonth')
        repairlistmonth.push(originlist[i])
        console.log('month', repairlistmonth)
      }
      if ((year == cyear) && (month == cmonth) && (day == cday)) {
        console.log('day=cyday')
        repairlistday.push(originlist[i])
        console.log('day', repairlistday)
      }
    }
  },
  onLoad: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  repairUnhandled() {
    var that = this
    wx.showLoading({
      title: '正在获取信息'
    })
    wx.request({
      url: `${config.host}/repairUnhandled`,
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete() {
        wx.hideLoading()
      },
      success: function(res) {
        console.log(res);
        if (res.data.status == 'false') {
          console.log("no data!");
          that.setData({
            unrepairlist: ''
          })
          wx.showToast({
            title: '获取信息失败',
            icon: 'none',
            duration: 2500
          })
        } else {
          that.setData({
            unrepairlist: res.data.data
          })
        }
      },
      fail: function(res) {
        that.setData({
          unrepairlist: ''
        })
        wx.showToast({
          title: '获取信息失败',
          icon: 'none',
          duration: 1500
        })
        console.log(res);
        console.log("error!");
      },
    })
  },
  repairHandled() {
    var that = this

    wx.request({
      url: `${config.host}/repairHandled`,
      data: {
        manageid: wx.getStorageSync('info').id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res);
        if (res.data.status == 'false') {
          console.log("no data!");
          that.setData({
            repairlist: ''
          })
        } else {
          that.setData({
            repairlist: res.data.data
          })
          that.getAlllist()
          // wx.setStorageSync('unrepairlist', res.data)
          console.log("success load");
        }
      },
      fail: function(res) {
        console.log(res);
        console.log("error!");
      },
    })
  },
  onShow: function() {
    this.setData({
      change: 1,
      color1: '#2287e3',
      color2: '#CFCFCF'
    })
    var that = this
    //读出未处理的维修记录
    that.repairUnhandled()
    var that = this;
    //读出已处理的维修记录
    // that.repairHandled()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    var t1 = Date.now();
    that.setData({
      current: t1
    })
    this.onShow();
    wx.stopPullDownRefresh();
  },

  distribute: function(e) {
    var that = this
    var item = e.currentTarget.dataset.item;
    console.log(item)
    // try {
    //   wx.setStorageSync('repair_detail', item)
    // } catch (e) { }
    wx.navigateTo({
      url: '../distributerepair/index?repairid=' + item.tableid,
    })
  },


  change1: function(e) {
    this.setData({
      change: 1,
      color1: '#2287e3',
      color2: '#CFCFCF',
    })
    var that = this
    var t1 = Date.now();
    that.setData({
      current: t1
    })
    this.onShow();
  },

  change2: function(e) {
    // var specialid = wx.getStorageSync('info').id
    var that = this
    this.setData({
      change: 2,
      color2: '#2287e3',
      color1: '#CFCFCF',
    })
    that.repairHandled()
  },

  delete: function(e) {
    //console.log(e.currentTarget.dataset.item)
    var that = this
    var tableid = e.currentTarget.dataset.item.tableid
    console.log(tableid)
    var id = e.currentTarget.dataset.index
    console.log("id:", id)
    this.onLoad();
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      success: function(res) {
        if (res.confirm) {

          that.dbDelete(tableid, id)
          console.log('确定')

        } else {
          console.log('取消')
        }
      },
    })
  },

  delete2: function(e) {
    //console.log(e.currentTarget.dataset.item)
    var that = this
    var tableid = e.currentTarget.dataset.item.tableid
    console.log(tableid)
    var id = e.currentTarget.dataset.index
    console.log("id:", id)
    this.onLoad();
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      success: function(res) {
        if (res.confirm) {

          that.dbDelete2(tableid, id)
          console.log('确定')

        } else {
          console.log('取消')
        }
      },
    })
  },
  dbDelete2(tableid, id) {
    var that = this
    console.log('id', id)

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
      success: function(res) {
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
          console.log("rlist1:", rlist)
          that.getAlllist()
        }
      },
      fail: function(res) {
        console.log("error!");
        // util.showModel('访问网络失败，请检查网络');
      },
    })
  },
  dbDelete(tableid, id) {
    var that = this
    console.log('id', id)
    var identity = wx.getStorageSync('info').identity
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
      success: function(res) {
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
          var rlist = that.data.unrepairlist
          console.log("rlist1:", rlist)
          rlist.splice(id, 1)
          that.setData({
            unrepairlist: rlist
          })
          console.log("rlist1:", rlist)
          // that.repairUnhandled()
        }
      },
      fail: function(res) {
        console.log("error!");
        // util.showModel('访问网络失败，请检查网络');
      },
    })
  }
})