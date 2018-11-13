// pages/punch_card/punch_card.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let page_size = 20;
let page_index = 1;
let totalPage = 0;
let userId = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadMoreData: '加载更多……',
        refreshTime: '',
        list: '',
        totalCount: 0,
    },
    getData: function () {
        let that = this;
        let para = {
            page_size: page_size,
            page_index: page_index,
            union_id: userId
        }
        wx.showLoading({
            title: '加载中...',
        })
        ajax.GET({
            url: '/m/promoter/center_wxx/check_in_list',
            data: para,
            success: function (res) {
                let list = '';
                let dataModel = res.data.data;
                if (res.data.success) {
                    wx.hideLoading();
                    if (res.data.data.items && res.data.data.items.length) {
                        list = res.data.data.items.map(function (item) {
                            let t = item.uploadTime + '';
                            item.uploadTime = t.slice(0, 4) + '-' + t.slice(4, 6) + '-' + t.slice(6);
                            return item;
                        })
                        that.setData({
                            list: list,
                            totalCount: dataModel.totalCount
                        })
                        if (dataModel.totalPage < 20) {
                            that.setData({
                                loadMoreData: '已经到顶',
                                hideBottom: false,
                                list: list,
                            })
                        } else {
                            if (pageIndex == 1) { // 下拉刷新
                                totalPage = dataModel.totalPage;
                                that.setData({
                                    hideBottom: true,
                                    list: list,
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
                        that.setData({
                            list: [],
                            hideBottom: false,
                            loadMoreData: '已经到顶'
                        })
                        wx.showToast({
                            title: '暂无数据',
                            color: '#fff',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                    
                } else {
                    app.catchFunc(res);
                }
            },
            fail: function (err) {
                wx.showModal({
                    title: '错误',
                    content: err.errMsg,
                    showCancel: false
                })
            }
        })
    },
    loadMore: function () {
        var self = this;
        // 当前页是最后一页
        if (page_index >= totalPage) {
            self.setData({
                loadMoreData: '已经到顶',
                hideBottom: false,
            })
            return;
        }
        page_index++;
        self.setData({
            hideBottom: false
        })
        self.getData();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        userId = options.user_id;
        page_index = 1;
        var date = Date.parse(new Date());
        this.setData({
            refreshTime: util.formatTime(date, 'h:m:s'),
        })
        this.getData();
    },
})