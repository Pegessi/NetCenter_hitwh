// 普通用户页面
var config = require('../../../config')
Page({
  /**
   * 页面的初始数据
   * background-轮播图标题，暂无用 imgList-公众号推送封面图 url为图片链接 str为标题 link为实际链接
   * noticeList-校园通知列表 title为爬取的标题 time为发布时间 link为实际链接
   */
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    imgList: [{
        'url': 'http://pegessi.ltd:2233/img/page.png',
        'str': 'Gnome',
        'link': 'https://mp.weixin.qq.com/s/1UaQY6JTThQAHrNtsJBSSw'
      },
      {
        'url': 'http://pegessi.ltd:2233/img/back.jpg',
        'str': '服务大厅',
        'link': 'https://mp.weixin.qq.com/s/WGcYjQ05bBJbXW2r7eEWug'
      },
      {
        'url': 'http://pegessi.ltd:2233/img/chaotica.png',
        'str': '分型艺术',
        'link': 'https://mp.weixin.qq.com/s/dDlLQRmFwTiYlkDPj-vmdA'
      },
      {
        'url': 'http://pegessi.ltd:2233/img/easyDL.png',
        'str': '定制化AI',
        'link': 'https://mp.weixin.qq.com/s/UiCWE3yfdi6eBgMZ_yRoEg'
      },
      {
        'url': 'http://pegessi.ltd:2233/img/west.jpg',
        'str': '西部世界',
        'link': 'https://mp.weixin.qq.com/s/N8R9N4efIv5bXAQCR7cZbw'
      },
    ],
    noticeList: [{
        'title': '关于开展哈尔滨工业大学（威海）2020年度考核的通知',
        'time': '2020-11-16',
        'link': 'https://www.hitwh.edu.cn/2020/1115/c1309a129496/page.htm'
      },
      {
        'title': '关于召开全校干部大会的通知',
        'time': '2020-11-27',
        'link': 'https://www.hitwh.edu.cn/2020/1127/c1309a130098/page.htm'
      },
      {
        'title': '关于2020年专业技术职务评审聘任工作的通知',
        'time': '2020-11-13',
        'link': 'https://www.hitwh.edu.cn/2020/1113/c1309a129438/page.htm'
      },
      {
        'title': '“百年光音·万象新声”第二十三届校园十佳歌手大赛...',
        'time': '2020-11-28',
        'link': 'https://www.hitwh.edu.cn/2020/1128/c1309a130128/page.htm'
      }
    ],
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})