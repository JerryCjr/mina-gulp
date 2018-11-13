// pages/training/training.js
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
        classList: [],
        title: '',
        hideBottom: true,
        loadMoreData: '加载更多……',
        refreshTime: '', // 刷新的时间
        totalCount: 0
    },
    getList: function () {
        let that = this;
        let pageIndex = page_index;
        let para = {
            train_id: app.globalData.lessonId,
            page_size: page_size,
            page_index: page_index,
        }

        ajax.GET({
            url: '/m/promoter/wiki/lesson/training/pr',
            data: para,
            success: function (res) {
                if (res.data.success && res.data.data.items && res.data.data.items.length) {
                    let dataModel = res.data.data;
                    console.log(dataModel)
                    that.setData({
                        totalCount: dataModel.totalCount,
                        title: dataModel.items[0].entity.courseName
                    })
                    if (dataModel.totalPage === 1) {
                        that.setData({
                            loadMoreData: '已经到顶',
                            hideBottom: false,
                            classList: dataModel.items,
                        })
                    } else {
                        if (pageIndex == 1) { // 下拉刷新
                            totalPage = dataModel.totalPage;
                            that.setData({
                                classList: dataModel.items,
                                hideBottom: true,
                            })
                        } else { // 上拉加载
                            let tempArray = that.data.classList;
                            tempArray = tempArray.concat(classList);
                            totalPage = dataModel.totalPage;
                            that.setData({
                                classList: tempArray,
                                hideBottom: true,
                            })
                        }
                    }
                } else {
                    that.setData({
                        classList: [],
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
        setTimeout(function () {
            let tempCurrentPage = page_index;
            tempCurrentPage++;
            page_index = tempCurrentPage;
            self.setData({
                hideBottom: false
            })
            self.getList();
        }, 0);
    },
    getLink: function (e) {
        app.globalData.linkId = e.target.dataset.id;
        wx.navigateTo({
            url: './lessonContent'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        page_index = 1;
        var date = Date.parse(new Date());
        this.setData({
            refreshTime: util.formatTime(date, 'h:m:s'),
        })
        this.getList();
    }
})