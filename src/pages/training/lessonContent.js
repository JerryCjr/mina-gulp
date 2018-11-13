// pages/training/training.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let content = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: [],
        starT: '',
        endT: ''
    },
    getList: function (type) {
        let that = this;
        let para = {
            id: app.globalData.linkId,
            type: type
        }
        ajax.GET({
            url: '/m/promoter/wiki/training/content',
            data: para,
            success: function (res) {
                if (res.data.success) {
                    that.setData({
                        content: res.data.data,
                        starT: util.formatTime(res.data.data.startTime, 'Y.M.D h:m'),
                        endT: util.formatTime(res.data.data.endTime, 'Y.M.D h:m')
                    })
                    content = res.data.data.content;
                } else {
                    wx.showToast({
                        title: res.data.errMsg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    gainFun: function () {
        this.getList(1);
    },
    saveFun: function () {
        let para = {
            wiki_id: app.globalData.linkId,
            content: content
        }
        ajax.POST({
            url: '/m/promoter/wiki/save',
            data: para,
            success: function (res) {
                console.log(res)
                if (res.data.success) {
                    wx.showToast({
                        title: '保存成功',
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
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
    copyFun: function () {
        wx.setClipboardData({
            data: content,
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
        this.getList(0);
    }
})