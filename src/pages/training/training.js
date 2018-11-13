// pages/training/training.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classList: [],
    },
    getClassList: function () {
        let that = this;
        ajax.GET({
            url: '/m/promoter/wiki/course/training',
            // url: '/m/promoter/wiki/lesson/training',
            success: function (res) {
                console.log(res)
                if (res.data.success && res.data.data && res.data.data.length) {
                    let dataModel = res.data.data;
                    that.setData({
                        classList: dataModel
                    })
                } else {
                    wx.showToast({
                        title: '暂无数据',
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    navTo: function (e) {
        app.globalData.lessonId = e.target.dataset.id;
        wx.navigateTo({
            url: './lesson'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getClassList();
    }
})