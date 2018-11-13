// pages/business/teamMember.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let page_size = 20;
let page_index = 1;
let totalPage = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        range_number: '',
        id: '',
        station: '',
        list: [],
        hideBottom: true,
        loadMoreData: '加载更多……',
        refreshTime: '', // 刷新的时间 
    },
    
    getData: function () {
        let that = this;
        let para = {
            station_number: this.data.station,
            page_size: page_size,
            page_index: page_index,
        }
        ajax.GET({
            url: '/m/promoter/get_group_users',
            data: para,
            success: function (res) {
                if (res.data.success && res.data.data.items && res.data.data.items.length) {
                    let dataModel = res.data.data;
                    if (dataModel.totalPage == 1) {
                        that.setData({
                            loadMoreData: '已经到顶',
                            hideBottom: false,
                            list: dataModel.items,
                        })
                    } else {
                        if (page_index == 1) { // 下拉刷新
                            totalPage = dataModel.totalPage;
                            that.setData({
                                list: dataModel.items,
                                hideHeader: true
                            })
                        } else { // 上拉加载
                            let tempArray = that.data.list;
                            tempArray = tempArray.concat(dataModel.items);
                            totalPage = dataModel.totalPage;
                            that.setData({
                                list: tempArray,
                                hideBottom: true,
                            })
                        }
                    }
                } else {
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

    checkStation: function (e) {
        this.setData({
            station: e.detail.value
        })
    },
    
    searchFun: function () {
        page_size = 10;
        page_index = 1;
        this.getData();
    },

    loadMore: function (e) {
        var self = this;
        // 当前页是最后一页
        if (page_index >= totalPage) {
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var date = Date.parse(new Date());
        this.setData({
            refreshTime: util.formatTime(date, 'h:m:s'),
            range_number: options.date_range_number,
            id: options.id
        })
        this.getData();
    },
})