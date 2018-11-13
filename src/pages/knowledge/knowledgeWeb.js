// pages/knowledge/knowledgeWeb.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        url: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var url = 'https://m.babyfs.cn'
        if (app.globalData.host !== "https://m.babyfs.cn") {
            url = 'http://m.dev.babyfs.cn'
        }
        let stationNumber = options.stationNumber;
        let webViewUrl = url + '/#/pro_wiki_index?stationNumber=' + stationNumber + '&token=' + encodeURIComponent(wx.getStorageSync('token')) + '&type=' + options.type;
        this.setData({
            url: webViewUrl
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})