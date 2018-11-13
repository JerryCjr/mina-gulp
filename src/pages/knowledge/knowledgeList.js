// pages/knowledge/knowledgeList.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let page_size = 20;
let page_index = 1;
let totalPage = 0;
let types = '';
let pic = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pic: '',
        text: '',
        hideBottom: true,
        loadMoreData: '加载更多……',
        refreshTime: '', // 刷新的时间
        list: []
    },

    getData: function () {
        let that = this;
        let list = [];
        let para = {
            page_size: page_size,
            page_index: page_index,
            type: types
        }
        wx.showLoading({
            title: '加载中...',
        })
        ajax.GET({
            url: '/m/promoter/wiki/list',
            data: para,
            success: function (res) {
                if (res.data.success && res.data.data.items && res.data.data.items.length) {
                    let dataModel = res.data.data;
                    totalPage = dataModel.totalPage;
                    list = dataModel.items.map((item) => {
                        item.entity.showTime = util.formatTime(item.entity.showTime, 'Y-M-D');
                        return item
                    })
                    if (dataModel.totalPage == 1) {
                        wx.hideLoading();
                        that.setData({
                            loadMoreData: '已经到顶',
                            hideBottom: false,
                            list: list,
                        })
                    } else {
                        wx.hideLoading();
                        if (page_index == 1) { // 下拉刷新
                            totalPage = dataModel.totalPage;
                            that.setData({
                                list: list,
                                hideHeader: true
                            })
                        } else { // 上拉加载
                            let tempArray = that.data.list;
                            tempArray = tempArray.concat(list);
                            totalPage = dataModel.totalPage;
                            that.setData({
                                list: tempArray,
                                hideBottom: true,
                            })
                        }
                    }
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: '暂无数据',
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                    that.setData({
                        list: [],
                        hideBottom: false,
                        loadMoreData: '已经到顶',
                    })
                }
            }
        })
    },

    loadMore: function (e) {
        var self = this;
        wx.showLoading({
            title: '加载中...',
        })
        console.log(page_index)
        console.log(totalPage)
        // 当前页是最后一页
        if (page_index >= totalPage) {
            console.log(99)
            wx.hideLoading();
            self.setData({
                loadMoreData: '已经到顶',
                hideBottom: false,
            })
            return;
        }
        setTimeout(function () {
            let tempCurrentPage = page_index;
            tempCurrentPage++;
            page_index = tempCurrentPage;
            self.setData({
                hideBottom: false
            })
            self.getData();
        }, 0);
    },

    navTo: function (e) {
        let stationNumber = app.globalData.staNumber;
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/repository/repository?id=' + id + '&stationNumber=' + stationNumber,
            // url: '/pages/knowledge/knowledgeWeb?id=' + id + '&stationNumber=' + stationNumber,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(wx.getStorageSync('token'))
        page_index = 1;
        types = options.types;
        var date = Date.parse(new Date());
        this.setData({
            refreshTime: util.formatTime(date, 'h:m:s'),
            pic: options.pic,
            text: options.text
        })
        this.getData();
    },
})