// pages/primerCode/primerCode.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: '',
        num: ''
    },

    previewImage: function (e) {
        let that = this;
        wx.previewImage({
            current: that.data.src, // 当前显示图片的http链接 
            urls: [that.data.src] // 需要预览的图片http链接列表 
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.url)
        this.setData({
            src: options.url,
            num: app.globalData.staNumber
        })
    },
})