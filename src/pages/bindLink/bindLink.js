// pages/bindLink/bindLink.js
const app = getApp();
let util = require('../../utils/util.js');
let url = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        codeImg: '',
        bindTime: '',
        qrCodeURL: ''
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
    copyFun: function () {
        wx.setClipboardData({
            data: url,
            success: function (res) {
                if (res.errMsg === 'setClipboardData:ok') {
                    wx.showToast({
                        title: '复制成功',
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: res.errMsg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            codeImg: app.globalData.linkCode,
            bindTime: util.formatTime(app.globalData.bindTime - 86400000 * 7, 'Y-M-D h:m'),
            qrCodeURL: app.globalData.qrCodeURL + '?s=' + app.globalData.staNumber
        })
        url = '请点击链接关注我们的公众号,及时获取集训营课程提醒，以及更多精彩内容：' + app.globalData.qrCodeURL + '?s=' + app.globalData.staNumber;
    }
})
