// pages/pro_poster/pro_poster.js
const app = getApp()
let ajax = require('../../utils/ajax.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        postersType: 3,
        items: []
    },

    getList: function () {
        app.globalData.detailsData.posterType = 0;
        let that = this;
        let para = {
            // poster_type: 0,  
            poster_type : this.data.postersType
        }
        ajax.GET({
            url: '/poster/amb/list',
            data: para,
            success: function (res) {
                if (res.data.success) {
                    if (res.data.data.data.items.length === 0) {
                        wx.showToast({
                            title: '暂无数据',
                            color: '#fff',
                            icon: 'none',
                            duration: 2000
                        })
                        that.setData({
                            items: []
                        })
                    } else {
                        that.setData({
                            items: res.data.data.data.items
                        })
                    }       
                    
                } else {
                    app.catchFunc(res);
                }
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
            url: '/pages/poster/template?id=' + 1 + '&postersType=' + this.data.postersType,
        })
    },

    // clickType: function (e) {
    //     this.setData({
    //         postersType: e.target.dataset.type
    //     })
    //     this.getList()
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getList();
    },
})