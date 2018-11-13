

const app = getApp()
let ajax = require('../../utils/ajax.js')
Page({
    data: {
        scrollTop: 100,
        leaderType: 0,
        postersType: 0,
        items: []
    },

    onReady: function () {
        var that = this
        ajax.GET({
            url: '/m/promoter/info3',
            success: function (res) {
                that.setData({
                    leaderType: res.data.data.promoter.leaderType
                })
                setTimeout(() => {
                    that.listData()
                }, 100)
            },
            fail: function () {
                wx.showModal({
                    title: '请求失败！',
                    content: data.msg,
                    showCancel: false
                })
            }
        })
    },

    listData: function () {
        var that = this
        app.globalData.detailsData.posterType = that.data.postersType
        ajax.GET({
            url: '/poster/list',
            data:{
                promoter_type: that.data.leaderType,
                poster_type: that.data.postersType
            },
            success: function (res) {
                if (res.data.data.data.items.length === 0) {
                    wx.showToast({
                        title: '暂无数据',
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
                that.setData({
                    items: res.data.data.data.items
                })
            },
            fail: function (res) {
                wx.showToast({
                    title: '加载失败',
                    color: '#fff',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },

    clickDetails: function (e) {
        var index = e.target.dataset.index
        if (this.data.items[index].img.indexOf('http://') != -1) {
            var img = this.data.items[index].img.replace('http://', 'https://')
        }
        app.globalData.detailsData.img = img
        app.globalData.detailsData.id = this.data.items[index].id
        app.globalData.detailsData.postersName = this.data.items[index].name
        app.globalData.detailsData.hb = e.target.dataset.hb
        wx.navigateTo({
            url: './template?postersType=' + this.data.postersType,
        })
    },

    clickType: function (e) {
        var that = this
        that.setData({
            postersType: e.target.dataset.type
        })
        app.globalData.detailsData.posterType = e.target.dataset.type
        that.listData()
    }

})