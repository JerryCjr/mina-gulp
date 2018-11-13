const app = getApp();
let ajax = require('../../utils/ajax.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        user_phone: '',
        userInfo: ''
    },
    getInfo: function () {
        var that = this;
        ajax.GET({
            url: '/m/promoter/info',
            success: function (res) {
                if (res.data.success) {
                    if (res.data.data.apply) { // 如果存在 apply 实体。则说明是提交了审核在审核状态中
                        that.setData({
                            userInfo: res.data.data,
                            user_phone: res.data.data.user.mobile
                        })
                    } else if (res.data.data.promoter) { // 如果存在 promoter 实体。则说明是审核通过成为了一个推广人
                        wx.redirectTo({
                            url: '/pages/home/home'
                        })
                    }
                } else {
                    wx.redirectTo({
                        url: '/pages/login/completeInfo?reApply=' + false,
                    })
                    wx.showToast({
                        title: res.data.msg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: function (err) {

            }
        })
    },
    reApply: function () {
        wx.redirectTo({
            url: '/pages/login/completeInfo?reApply=' + true,
        })
    },
    windowClose: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        this.getInfo();
    }
})