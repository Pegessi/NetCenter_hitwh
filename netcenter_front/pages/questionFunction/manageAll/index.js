// pages/questionFunction/manageAll/index.js
var bOneOver = false;
var aListKeys = [];

var config = require('../../../config')
var util = require('../../../utils/util.js')
var oProblemList = {}
var questionType = {}
var dic = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sTextValue: '',
    iPickerIndex0: 0, //key index
    iPickerIndex1: 0, //question index
    iPickerIndex2: 0, //type index
    aPickerArray0: [], //key list
    aPickerArray1: [], //question list
    aPickerArray2: [], //正确顺序的问题类型
    tabpage: 0,
    solution: '',
    // typeContent: '',
    typeIndex: 0,
    addType: '',
    showFlag:false
    // type: ['网络认证故障', '电脑掉线', '网线接口说明', '无线网常见故障', '网络中心说明', 'SAM系统说明', '网络账号说明', '网络费用说明', '网络打印机', '腾讯通说明'],
  },
  modifyType(){
    let that = this

    var identity = wx.getStorageSync('info').identity
    console.log(identity)
    let type = that.data.iPickerIndex2 
    let key = questionType[type].id
    console.log('type', type)
    console.log('key', key)
    if (that.data.newType == "" || that.data.newType==undefined){
      wx.showToast({
        title: '无修改',
        icon: 'none',
        duration: 1500
      });
      return
    } 
    wx.showLoading({
      title: '正在修改'
    })
    console.log('newType:', that.data.newType)
    wx.request({
      url: `${config.host}/typeModify`,
      data: {
        id: key,
        type: that.data.newType,
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
        if (res.data.status == '001' || res.data.status == '004') {
          wx.showToast({
            title: '修改失败',
            content: '请稍后重试',
            icon: 'none',
            duration: 2500
          });
          // util.showModel('该维修人员不存在');
          // util.showModel('学工号不存在');
        } else if (res.data.status == '002') {
          wx.showToast({
            title: '无权限修改',
            content: '请稍后重试',
            icon: 'none',
            duration: 2500
          });
        } else if (res.data.status == '003') {
          wx.showToast({
            title: '数据库错误',
            content: '请稍后重试',
            icon: 'none',
            duration: 2500
          });
        } else if (res.data.status == "100") {
          console.log(res.data);
          that.fnGetProblemList()
          util.showSuccess("修改成功")
        }
      },
      fail: function (res) {
        console.log(res);
        console.log("error!");
      },
    })
  },
  dbdeleteType(){
    var that = this
    var identity = wx.getStorageSync('info').identity
    console.log(identity)
    let type = that.data.iPickerIndex2 
    let key = questionType[type].id
    console.log('type', type)
    console.log('key', key)
    wx.showLoading({
      title: '正在删除'
    })
    wx.request({
      url: `${config.host}/typeDelete`,
      data: {
        id: key,
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
        console.log(res);
        if (res.data.status == '001' || res.data.status == '004') {
          console.log("no data!");
          wx.showToast({
            title: '删除失败',
            content: '请稍后重试',
            icon: 'none',
            duration: 2500
          });
        }else if(res.data.status=="002"){
          wx.showToast({
            title: '无权限删除',
            content:'该分类下有问题指南',
            icon: 'none',
            duration: 2500
          });
        } else if (res.data.status == "003") {
          wx.showToast({
            title: '删除失败',
            content: '数据库错误',
            icon: 'none',
            duration: 2500
          });
        }else if(res.data.status=="100"){
          that.fnGetProblemList()
          that.setData({
            iPickerIndex2: 0
          })
          util.showSuccess("删除成功")
        }
      },
      fail: function (res) {
        console.log(res);
        console.log("error!");
        wx.showToast({
          title: '删除失败',
          content: '数据库/网络错误',
          icon: 'none',
          duration: 2500
        });
      },
    })
  },
  deleteType(e){
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除该分类？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.dbdeleteType()
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this
    let aPickerArray2 = []

    that.fnGetProblemList()

  },
  //  fnGetType: function(e) {
  //    var that = this
  //    let value = e.detail.value - 0;
  //    that.setData({
  //      typeIndex: value
  //    })
  //    //console.log('type',value)
  //  },
  fnGetSolution: function(e) {
    var that = this
    //console.log(e.detail.value)
    that.setData({
      solution: e.detail.value
    })
  },
  fnGetnewType(e){
    var that = this
    //console.log(e.detail.value)
    that.setData({
      newType: e.detail.value
    })
  },
  //增加问题类型
  fnTypeAdd: function(e) {
    var that = this
    var identity = wx.getStorageSync('info').identity
    console.log(identity)
    let type = e.detail.value.typeAdd
    console.log(type)
    wx.showLoading({
      title: '正在添加'
    })
    wx.request({
      url: `${config.host}/questionTypeAdd`,
      data: {
        type: type,
        identity: identity
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        if (res.data.status == '001' || res.data.status == '004') {
          console.log("no data!");
          wx.showToast({
            title: '提交失败',
            content: '请稍后重试',
            icon: 'none',
            duration: 2500
          });
        } else if (res.data.status == "002") {
          wx.showToast({
            title: '无权限提交',
            content: '该分类下有问题指南',
            icon: 'none',
            duration: 2500
          });
        } else if (res.data.status == "003") {
          wx.showToast({
            title: '数据库错误',
            icon: 'none',
            duration: 2500
          });
        } else if (res.data.status == "100"){
          util.showSuccess('提交成功');
          that.setData({
            addType: ''
          })

          that.fnGetProblemList()
          that.setData({
            iPickerIndex0: 0
          })

          // console.log('beforeadd', questionType)
          // questionType.push(type)
          // console.log('after', questionType)
          // wx.setStorageSync('questionType', questionType)
          // for (let i = 0; i < questionType.length; i++) {
          //   aPickerArray2.push(questionType[i].type)
          // }
          // that.setData({
          //   aPickerArray2: aPickerArray2
          // })
          // that.operation()
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


  //增加问题指南
  formsubmit: function(e) {
    var that = this
    console.log(e.detail.value.question)
    console.log(that.data.typeIndex)
    console.log(that.data.solution)
    var identity = wx.getStorageSync('info').identity
    console.log(identity)
    let solution = that.data.solution
    let type = that.data.iPickerIndex2 + 1
    let key = questionType[type - 1].id
    console.log('type', type)
    let description = e.detail.value.question
    console.log('key', key)

    if (solution == '' || solution == undefined || description == '' || description == undefined) {
      wx.showToast({
        title: '信息不完整',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '正在添加'
      })
      wx.request({
        url: `${config.host}/questionAdd`,
        data: {
          solution: solution,
          description: description,
          type: key,
          identity: identity
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        complete() {
          wx.hideLoading()
        },
        success: function(res) {
          if (res.data.status == '001' || res.data.status == '004') {
            console.log("no data!");
            wx.showToast({
              title: '提交失败',
              content: '请稍后重试',
              icon: 'none',
              duration: 2500
            });
          } else if (res.data.status == "002") {
            wx.showToast({
              title: '无权限提交',
              icon: 'none',
              duration: 2500
            });
          } else if (res.data.status == "003") {
            wx.showToast({
              title: '数据库错误',
              icon: 'none',
              duration: 2500
            });
          } else if (res.data.status == "100") {
            util.showSuccess('提交成功');
            var adddata = {
              solution: solution,
              description: description,
              type: type
            }
            // console.log('oProblemList', oProblemList[key])
            // oProblemList[key].splice(-1, 0, adddata)

            // wx.setStorageSync('questionList', oProblemList)

            that.setData({
              value: '',
              iPickerIndex2: 0,
              addSolution: ''
            })

            that.fnGetProblemList()
            // that.operation()
            // // that.fnGetProblemList()
            // that.fnGetTypeList()
          }
        },
        fail: function() {
          // fail
          console.log("error")
        }
      })
    }

  },

  onShow: function() {},

  // 更换tab
  fnSwitchTab(event) {
    this.setData({
      tabpage: event.currentTarget.dataset.page - 0
    })
  },

  // 实现联动
  fnSetPicker(iPickerIndex0) { //传入 问题分类 也就是key的index
    let key = this.data.aPickerArray0[iPickerIndex0 - 0]
    console.log('传入的key', key)
    let aSubProblemList = oProblemList[key];
    let aPickerArray1 = [];
    console.log('', iPickerIndex0)
    var length = aSubProblemList.length
    if (length==undefined||length==null||length==''){
      var description=''

      aPickerArray1.push(description)
      this.setData({
        aPickerArray1: aPickerArray1,
        showFlag:true
      })
    } else {
      for (let i = 0; i < length; i++) {
        aPickerArray1.push(aSubProblemList[i].description)
      }
      this.setData({
        aPickerArray1: aPickerArray1,
        showFlag: false
      })
      console.log('设置aPickerArray1:', aPickerArray1)}
    
  },

  // 问题类型
  fnPickerChange0(event) {
    let value = event.detail.value - 0;
    this.setData({
      iPickerIndex0: value,
      iPickerIndex1: 0
    })
    console.log('keyIndex:', value)
    this.fnSetPicker(value);
    console.log(oProblemList[this.data.aPickerArray0[value]][0])
    if (oProblemList[this.data.aPickerArray0[value]][0] != undefined) {
      this.fnSetInputValue(oProblemList[this.data.aPickerArray0[value]][0].solution);
    } else {
      this.setData({
        sTextValue: '该类别暂无问题'
      })
    }
  },

  // 问题条目
  fnPickerChange1(event) {
    let value = event.detail.value - 0;
    console.log('具体问题的选择index:', value)
    this.setData({
      iPickerIndex1: value
    })
    let key = this.data.aPickerArray0[this.data.iPickerIndex0]
    console.log('key:', key)
    console.log('value', value)
    this.fnSetInputValue(oProblemList[key][value].solution);
  },
  //增加问题指南的类型选择
  fnPickerChange2(event) {
    let value = event.detail.value - 0;
    console.log('具体问题的选择index:', value)
    this.setData({
      iPickerIndex2: value
    })
  },
  // 输入完成
  fnEndInput(event) {
    this.fnSetInputValue(event.detail.value)
  },

  // 修改条目最后确定的值
  fnSetInputValue(sTextValue) {
    this.setData({
      sTextValue: sTextValue
    })
  },
  //修改该条目，并且修改本地存储记录
  fnSubmitFix() {
    let that = this
    let index = that.data.iPickerIndex1 //待修改问题的index
    let tmplist = that.data.aPickerArray1 //待修改问题
    //that.data.aPickerArray1  待删除问题所在类别的所有问题的list
    let key = that.data.aPickerArray0[that.data.iPickerIndex0] //类别index

    var identity = wx.getStorageSync('info').identity
    console.log(identity)
    let newSolution = that.data.sTextValue
    console.log('newSolution:', newSolution)
    wx.request({
      url: `${config.host}/questionModify`,
      data: {
        description: tmplist[index],
        solution: newSolution,
        identity: identity
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        if (res.data.status == '001' || res.data.status == '004') {
          console.log("no data!");
          wx.showToast({
            title: '提交失败',
            content: '请稍后重试',
            icon: 'none',
            duration: 2500
          });
        } else if (res.data.status == "002") {
          wx.showToast({
            title: '无权限提交',
            content: '该分类下有问题指南',
            icon: 'none',
            duration: 2500
          });
        } else if (res.data.status == "003") {
          wx.showToast({
            title: '数据库错误',
            icon: 'none',
            duration: 2500
          });
        } else if (res.data.status == "100") {
          console.log(res.data);
          oProblemList[key][index].solution = newSolution
          wx.setStorageSync('questionList', oProblemList)
          that.operation()
          that.setData({
            iPickerIndex0: 0,
            iPickerIndex1: 0,
            iPickerIndex2: 0
          })
          util.showSuccess("修改成功")
        }

      },
      fail: function(res) {
        console.log(res);
        console.log("error!");
      },
    })
  },
  //删除该条目，并且修改本地存储记录
  fnSubmitDel() {
    let that = this
    var identity = wx.getStorageSync('info').identity
    console.log(identity)
    let index = that.data.iPickerIndex1 //待删除问题的index
    let tmplist = that.data.aPickerArray1 //待删除问题
    let key = that.data.aPickerArray0[that.data.iPickerIndex0] //类别index
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.request({
            url: `${config.host}/questionDelete`,
            data: {
              description: tmplist[index],
              identity: identity
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              console.log(res);

              if (res.data.status == '001' || res.data.status == '004') {
                console.log("no data!");
                wx.showToast({
                  title: '删除失败',
                  content: '请稍后重试',
                  icon: 'none',
                  duration: 2500
                });
              } else if (res.data.status == "002") {
                wx.showToast({
                  title: '无权限删除',
                  icon: 'none',
                  duration: 2500
                });
              } else if (res.data.status == "003") {
                wx.showToast({
                  title: '数据库错误',
                  icon: 'none',
                  duration: 2500
                });
              } else if (res.data.status == "100") {

                util.showSuccess("删除成功")
                // tmplist.slice(index, 1)
                oProblemList[key].splice(index, 1)
                that.operation()
                wx.setStorageSync('questionList', oProblemList)
                that.setData({
                  iPickerIndex0: 0,
                  iPickerIndex1: 0,
                  iPickerIndex2: 0,
                })

                that.onLoad()
              }
            },
            fail: function(res) {
              console.log(res);
              console.log("error!");
            },
          })

        } else if (res.cancel) {

        }
      }
    })

  },

  //当缓存中无数据时调用

  // 获得问题类型
  fnGetTypeList() {
    let that = this
    wx.request({
      url: `${config.host}/questionTypeGetAll`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('res:', res)
        if (res.data.status == 'false') {
          console.log("error")
        } else {
          questionType = res.data;
          wx.setStorageSync('questionType', questionType)
          that.setData({
            questionType: questionType
          })
          that.operation()

        }
      },
      fail: console.error
    })
  },
  operation() {
    let that = this
    let aPickerArray2 = []
    // console.log('oProblemList', oProblemList)
    // // 问题选择picker
    // that.setData({
    //   aPickerArray0: Object.keys(oProblemList)
    // })
    console.log(questionType)
    // aPickerArray2 = questionType
    for (let i = 0; i < questionType.length; i++) {
      aPickerArray2.push(questionType[i].type)
    }
    that.setData({
      aPickerArray2: aPickerArray2,
      aPickerArray0: aPickerArray2
    })
    console.log('aPickerArray2', aPickerArray2)
    // console.log('aPickerArray0', aPickerArray0)
    console.log('问题分类1：', questionType)
    console.log('问题分类：', that.data.aPickerArray0)

    // console.log(that.data.aPickerArray0)
    that.fnSetPicker(0);
    let key = that.data.aPickerArray0[0]
    console.log('key', key)
    console.log('oProblemList[key]', oProblemList[key])
    that.fnSetInputValue(oProblemList[key][0].solution);

  },
  fnGetProblemList() {
    let that = this
    wx.request({
      url: `${config.host}/questionGetAll`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('res:', res)
        if (res.data.data.status == 'false') {
          console.log("error")
        } else {
          oProblemList = res.data.data;

          that.fnGetTypeList();
        }
      },
      fail: console.error
    })
  }

})