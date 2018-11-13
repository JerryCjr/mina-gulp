// pages/repository/repository.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let WxParse = require('../../wxParse/wxParse.js');
let id = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: '',
        flag: false
    },

    clickFun: function (e) {
        this.setData({
            src: e.currentTarget.dataset.src,
            flag: true
        })
    },

    hideFun: function () {
        this.setData({
            flag: false
        })
    },

    getData: function () {
        let that = this;
        wx.showLoading({
            title: '加载中...',
        })
        ajax.GET({
            url: '/m/promoter/wiki/content',
            data: {
                id: id
            },
            success: function (res) {
                if (res.data.success) {
                    wx.hideLoading();
                    let article = res.data.data.entity.content;
                    WxParse.wxParse('article', 'html', article, that, 5);
                } else {
                    wx.hideLoading();
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        id = options.id;
        this.getData();
    }
})