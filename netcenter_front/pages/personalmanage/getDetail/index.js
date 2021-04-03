// pages/personalmanage/getDetail/index.js
const app = getApp()
var code = null
var openid = null
var config = require('../../../config')
var util = require('../../../utils/util.js')
var tmp = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /*新加部分 */
    // dateFirst:'0000-00-00',
    // dates: null,
    // index: 0,
    //新家结束
    //时间检索
    dateFrom: '',
    dateTo: '',
    year: 0,
    month: 0,
    day: 0,
    //检索over
    unrepairlist: {},
    allrepairlist: {},
    unrepairlistLength: 0,
    allrepairlistLength: 0,
    array: [{
      name: '1',
      value: '本日'
    },
    {
      name: '2',
      value: '本月',
    },
    {
      name: '3',
      value: '本年',
      checked: 'true'
    },
    ],
    repairlistyear: {},
  },

  getAll(workmanid){
    var that=this
    console.log('workmanid:', workmanid)
    wx.request({
      url: `${config.host}/repairWorkman`,
      data: {
        id: workmanid
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
          wx.setStorageSync('allrepairlist', '')
          console.log("no data!");
          that.setData({
            allrepairlist: {},
            allrepairlistLength: 0
          })
        } else {
          wx.setStorageSync('allrepairlist', res.data.data)
          that.setData({
            allrepairlist: res.data.data,
            allrepairlistLength: res.data.length
          })
          console.log(that.data.allrepairlist);
          console.log("success load");
        }
      },
      fail: function (res) {
        console.log(res);
        console.log("error!");
      },
    })
  },
  getUnfinished(workmanid){
    var that=this
    wx.showLoading({
      title: '正在获取信息'
    })
    // that.setData({
    //   unrepairlist: wx.getStorageSync('allrepairlist')
    // })
    console.log('workmanid',workmanid)
    wx.request({
      url: `${config.host}/repairUnfinished`,
      data: {
        userid: workmanid
      },
      method: 'Get',
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
          that.setData({
            unrepairlist: {},
            unrepairlistLength: 0
          })
        } else {
          if (res.data.length == null || res.data.length==''){
            that.setData({
              unrepairlist: res.data.data,
              unrepairlistLength: 0
            })
          }
          that.setData({
            unrepairlist: res.data.data,
            unrepairlistLength: res.data.length
          })
          console.log("success load");
        }
      },
      fail: function (res) {
        console.log(res);
        console.log("error!");
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      item: wx.getStorageSync('workman')
    })
    this.setData({
      unrepairlistLength: null,
      allrepairlistLength: null,
    })
    this.setData({
      change: 3,
      color3: '#2287e3',
      color2: '#CFCFCF',
      color1: '#CFCFCF'
    })
    var date = new Date()
    var myDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    console.log('new date:', myDate)
    that.setData({
      dates: myDate,
      dateFrom: myDate,
      dateTo: myDate,
    })
    var workmanid = wx.getStorageSync('workman').id
    wx.showLoading({
      title: '正在获取信息'
    })
    //读出该用户所有的维修记录
    that.getAll(workmanid)
    //读出该维修人员待完成的维修记录
    that.getUnfinished(workmanid)
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      change: 3,
      color3: '#2287e3',
      color2: '#CFCFCF',
      color1: '#CFCFCF'
    })
    this.setData({
      //repairlistLength: null,
      unrepairlistLength: null,
      allrepairlistLength: null,
    })
  },
  //该维修人员待完成的单子
  change1: function (e) {
    this.setData({
      change: 1,
      color1: '#2287e3',
      color2: '#CFCFCF',
      color3: '#CFCFCF',
    })
    var that = this
    var workmanid = wx.getStorageSync('workman').id
    //读出该维修人员待完成的维修记录
    that.getUnfinished(workmanid)
  },


  //该维修人员接的全部单子
  change3: function (e) {
    this.setData({
      change: 3,
      color3: '#2287e3',
      color2: '#CFCFCF',
      color1: '#CFCFCF',
    })
    var that = this
    var workmanid = wx.getStorageSync('workman').id

    //读出该用户所有的维修记录
    that.getAll(workmanid)
  },
  bindDateFrom: function (e) {
    var that = this
    that.setData({
      dateFrom: e.detail.value
    })
  },
  bindDateTo: function (e) {
    var that = this
    that.setData({
      dateTo: e.detail.value
    })
  },
  //日期筛选：
  searchBegin: function () {
    var that = this
    var dfrom = that.data.dateFrom
    dfrom = new Date(Date.parse(dfrom));
    //    dfrom = dfrom.toLocaleString

    var dto = that.data.dateTo
    dto = new Date(Date.parse(dto));

    //    dto = dto.toLocaleString()
    var datelist = []
    var fyear = dfrom.getFullYear()
    var fmonth = dfrom.getMonth() + 1
    var fday = dfrom.getDate()
    var tyear = dto.getFullYear()
    var tmonth = dto.getMonth() + 1
    var tday = dto.getDate()
    var number1 = 0
    dfrom = fyear + '-' + fmonth + '-' + fday
    dto = tyear + '-' + tmonth + '-' + tday
    console.log(fyear + '-' + fmonth + '-' + fday)
    console.log(tyear + '-' + tmonth + '-' + tday)
    console.log('from', dfrom)
    console.log('to', dto)
    var originlist = wx.getStorageSync('allrepairlist');
    for (var i = 0, len = originlist.length; i < len; i++) {
      var origintime = originlist[i].submitdate
      origintime = origintime.replace(/-/g, '/');
      var oldTime = new Date(Date.parse(origintime));

      var date = new Date();
      var year = oldTime.getFullYear()
      var month = oldTime.getMonth() + 1
      // console.log(cmonth)
      var day = oldTime.getDate()
      
      // day = day.split(' ')
      // day = day[0]
      console.log('from', dfrom)
      console.log('old:', year + '-' + month + '-' + day)
      console.log('to', dto)

      if (year < tyear && year > fyear) {

        datelist.push(originlist[i])
        number1 = number1 + 1;
        console.log(number1)
      } else if (tyear == fyear && year == tyear) {//起始年份和终止年份相同，并且也和判断年份相同

        //开始判断月份和日期
        if (month < tmonth && month > fmonth) {

          datelist.push(originlist[i])
          number1 = number1 + 1;
          console.log(number1)
        } else if (fmonth == tmonth && month == tmonth) {//三者月份相同
          if (day <= tday && day >= fday) {
            datelist.push(originlist[i]);
            number1 = number1 + 1;
            console.log(number1)
          }
        } else if (month == fmonth) {
          if (day >= fday) {
            datelist.push(originlist[i]);
            console.log(number1)
            number1 = number1 + 1;
          }
        } else if (month == tmonth) {
          if (day <= fday) {
            datelist.push(originlist[i]);
            console.log(number1)
            number1 = number1 + 1;
          }
        }
      } else if (year == tyear) {
        if (month < tmonth) {
          datelist.push(originlist[i])
          console.log(number1)
          number1 = number1 + 1;
        } else if (month == tmonth) {
          if (day <= tday) {
            datelist.push(originlist[i])
            number1 = number1 + 1;
            console.log(number1)
          }
        }
      } else if (year == fyear) {
        if (month > fmonth) {
          datelist.push(originlist[i])
          number1 = number1 + 1;
          console.log(number1)
        } else if (month == fmonth) {
          if (day >= fday) {
            datelist.push(originlist[i])
            number1 = number1 + 1;
            console.log(number1)
          }
        }
      }
    }
    that.setData({
      allrepairlist: datelist,
      allrepairlistLength: number1
    })
  }
})