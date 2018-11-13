// pages/personal/detail.js
let app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        user_id: '',
        user_time: '',
        orderList: []
    },

    getOrder: function () {
        let that = this;
        let para = {
            user_id: that.data.user_id
        }
        ajax.GET({
            url: '/m/promoter/order',
            data: para,
            success: function (res) {
                console.log(res)
                if (res.data.success && res.data.data.data.items && res.data.data.data.items.length) {
                    let orderList = res.data.data.data.items;
                    orderList = orderList.map((item, idx) => {
                        item.money = (item.money) / 100;
                        item.payTime = util.formatTime(item.payTime, 'Y/M/D h:m');
                        return item;
                    })
                    that.setData({
                        orderList: orderList
                    })
                } else {
                    that.setData({
                        orderList: []
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
            user_id: options.user_id,
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getStudentInfo();
        this.getOrder();
    },

    getStudentInfo: function () {
        var that = this
        var _data = {
            user_id: this.data.user_id
        }
        ajax.GET({
            url: '/m/promoter/bind_user_detail_info',
            data: _data,
            success: function (res) {
                if (res.data.success) {
                    res.data.data.bindTime = util.formatTime(res.data.data.bindTime, 'Y.M.D h:m')
                    res.data.data.wechatName = res.data.data.wechatName.replace(/[\n]/g, "");
                    that.setData({
                        info: res.data.data
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },

    navTo: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/punch_card/student_punch_card?user_id=' + id,
        })
    }
})