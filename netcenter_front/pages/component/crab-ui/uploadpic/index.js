Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count: { //最多选择图片的张数，默认9张
      type: Number,
      value: 1
    },
    uploadUrl: { //图片上传的服务器路径
      type: String,
      value: ''
    },
    showUrl: { //图片的拼接路径
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    detailLocalPics: [], //上传的结果图片本地集合
    detailServerPics: []
  },

  ready: function() {
    console.log(this.data)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    uploadDetailImage() { //这里是选取图片的方法
      let that = this;

      // 选择图片
      wx.chooseImage({
        count: 3 - that.data.detailLocalPics.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          console.log('res:', res)

          // 用于暂时保存本次选中的图片
          let aNewImages = [];
          // 原有图片 - 此处可以用图片大小(精确到字节来处理用户多次上传同一张图的情况)
          let aOldImages = wx.getStorageSync("files");
          // 处理没有缓存的情况
          aOldImages = !aOldImages ? [] : aOldImages;

          // 记录有几张gif 用于过滤gif
          let iGifNum = 0;
          // let iSameNum = 0;
          for (let i = 0; i < res.tempFiles.length; i++) {
            if (res.tempFiles[i].path.split('.').pop().toLowerCase() === "gif") {
              // 该图片是gif
              iGifNum += 1;
            } else {
              aNewImages.push(res.tempFiles[i]);
            }
          }

          if (iGifNum > 0) {
            wx.showToast({
              title: '暂不支持上传Gif图片',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }

          that.setData({
            detailLocalPics: aOldImages.concat(aNewImages)
          })

          wx.setStorage({
            key: 'files',
            data: aOldImages.concat(aNewImages),
          })
        },
        fail: function(err) {
          console.error(err);
        }
      })
    },


    bindlongpressimg: function(event) {
      let id = event.currentTarget.dataset.id
      let tempFiles = [...this.data.detailLocalPics];
      tempFiles.splice(id, 1)

      this.setData({
        detailLocalPics: tempFiles
      })
      wx.setStorage({
        key: 'files',
        data: tempFiles
      })
    },

    // 预览图片
    previewImage(event) {
      let images = [];
      let id = event.currentTarget.dataset.id - 0;
      for (let i = 0; i < this.data.detailLocalPics.length; i++) {
        images.push(this.data.detailLocalPics[i].path);
      }
      wx.previewImage({
        current: images[id],
        urls: images
      })
    },
  }
})