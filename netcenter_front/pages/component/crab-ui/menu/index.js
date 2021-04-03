// components/Menu/menu.js
var systemInfo = wx.getSystemInfoSync();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icons: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,//是否已经弹出
    animMain: {},//旋转动画
    animSale: {},//item位移,透明度
    animBuy: {},//item位移,透明度
    animMy:{},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击弹出或者收起
    showOrHide: function () {
      if (this.data.isShow) {
        //缩回动画
        this.takeback();
        this.setData({
          isShow: false
        })
      } else {
        //弹出动画
        this.popp();
        this.setData({
          isShow: true
        })
      }
    },
    sale: function () {
      this.triggerEvent("saleIssue")
      this.showOrHide()
    },
    buy: function () {
      this.triggerEvent("buyIssue")
      this.showOrHide()
    },
    my: function () {
      this.triggerEvent("myIssue")
      this.showOrHide()
    },
    //弹出动画
    popp: function () {
      //main按钮顺时针旋转
      var animationMain = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationBuy = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationSale = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationMy = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      animationMain.rotateZ(180).step();
      animationBuy.translate(0, -180 / 750 * systemInfo.windowWidth).rotateZ(360).opacity(1).step();
      animationSale.translate(0, -300 / 750 * systemInfo.windowWidth).rotateZ(360).opacity(1).step();
      animationMy.translate(0, -420 / 750 * systemInfo.windowWidth).rotateZ(360).opacity(1).step();
      this.setData({
        animMain: animationMain.export(),
        animBuy: animationBuy.export(),
        animSale: animationSale.export(),
        animMy: animationMy.export(),
      })
    },
    //收回动画
    takeback: function () {
      //main按钮逆时针旋转
      var animationMain = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationBuy = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationSale = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationMy = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      animationMain.rotateZ(0).step();
      animationBuy.translate(0, 0).rotateZ(0).opacity(0).step();
      animationSale.translate(0, 0).rotateZ(0).opacity(0).step();
      animationMy.translate(0, 0).rotateZ(0).opacity(0).step();
      this.setData({
        animMain: animationMain.export(),
        animBuy: animationBuy.export(),
        animSale: animationSale.export(),
        animMy: animationMy.export(),
      })
    }
  },
  //解决滚动穿透问题
  myCatchTouch: function () {
    return
  }
})
