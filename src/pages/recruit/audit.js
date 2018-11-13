const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        info: '',
    },

    previewImage: function (e) {
        let that = this;
        let arrImg = [];
        arrImg.push(that.data.info.wxGroupUrl);
        wx.previewImage({
            current: arrImg, // 当前显示图片的http链接   
            urls: arrImg // 需要预览的图片http链接列表   
        })
    },

    getApply: function () {
        let that = this;
        ajax.GET({
            url: '/promoter/apply/info',
            success: function (res) {
                console.log(res.data)
                if (res.data.success) {
                    let info = res.data.data;
                    info.applyRangeEndTime = util.formatTime(info.applyRangeEndTime, 'M月D日')
                    that.setData({info: info})
                    wx.setNavigationBarTitle({
                        title: info.applyRangeName || '未知',
                    })
                    if (info.status == 6) {
                        wx.redirectTo({
                            url: '/pages/train/trainList/trainList',
                        })
                    }
                } else {
                    app.catchFunc(res);
                }
            }
        })
    },

    navTo: function () {
        ajax.POST({
            url: '/promoter/apply/reset',
            success: function (res) {
                console.log(res)
                wx.redirectTo({
                    url: '/pages/invite_page/invite_page',
                })
            }
        })
        
    },

    confirmFun: function () {
        ajax.POST({
            url: '/promoter/apply/confirm',
            success: function (res) {
                console.log(res)
                wx.redirectTo({
                    url: '/pages/train/trainList/trainList',
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        this.getApply();
    },

    onLoad: function (options) {
        console.log(options)
    },
})