// pages/new_pro_ enter/new_pro_enter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      codeImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          codeImg: options.qrcodeImg
      })
  },
    previewImage: function (e) {
        let that = this;
        let arrImg = [];
        arrImg.push(that.data.codeImg);
        wx.previewImage({
            current: arrImg, // 当前显示图片的http链接   
            urls: arrImg // 需要预览的图片http链接列表   
        })
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
})