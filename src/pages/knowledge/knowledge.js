// pages/knowledge/knowledge.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let page_size = 20;
let page_index = 1;
let totalPage = 0;
Page({
    data: {
        url: '',
        list: [],
        hideBottom: true,
        loadMoreData: '加载更多……',
        refreshTime: '', // 刷新的时间
        allcommidity: [
            {
                commodityList: [
                    {
                        images: 'https://i.s.babyfs.cn/op/1/3d08c40d6a4c43bfaaddd76d531a2fbf.png',
                        text: '岗前培训',
                        val: 0 
                    },
                    {
                        images: 'https://i.s.babyfs.cn/op/1/18970222fc444a11a3b0f31aa99af9d5.png',
                        text: '系统公告',
                        val: 1
                    },
                    {
                        images: 'https://i.s.babyfs.cn/op/1/6a8f03fe8c9047d3a4f9aaee21a77958.png',
                        text: '衔接培训',
                        val: 2
                    },
                    {
                        images: 'https://i.s.babyfs.cn/op/1/267a420fe9cc47f7bb5c9fc7eef3ca68.png',
                        text: '宝玩话术',
                        val: 3
                    },
                    {
                        images: 'https://i.s.babyfs.cn/op/1/dd64b165c83445079097b81d0e6be97c.png',
                        text: '相关竞品',
                        val: 4
                    },
                    {
                        images: 'https://i.s.babyfs.cn/op/1/eab0680797bc42f2a95f0983612a0525.png',
                        text: '课程教具',
                        val: 5
                    },
                ],
            },
        ]
    },
    getData: function () {
        let that = this;
        let list = [];
        let para = {
            page_size: page_size,
            page_index: page_index,
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
        // 当前页是最后一页
        if (page_index >= totalPage) {
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
        let types = e.currentTarget.dataset.item.val;
        let pic = e.currentTarget.dataset.item.images;
        let text = e.currentTarget.dataset.item.text;
        wx.navigateTo({
            url: '/pages/knowledge/knowledgeList?types=' + types + '&pic=' + pic + '&text=' + text,
        })
    },

    navTo1: function (e) {
        let stationNumber = app.globalData.staNumber;
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/repository/repository?id=' + id + '&stationNumber=' + stationNumber,
            // url: '/pages/knowledge/knowledgeWeb?id=' + id + '&stationNumber=' + stationNumber,
        })
    },

    getUrl: function () {
        let url = 'https://10.10.10.11/m/#/pro_wiki_index?stationNumber=L0001&?token' + wx.setStorageSync('token');
        this.setData({
            url: url
        })
        console.log(wx.getStorageSync('token'))
    },

    onShow: function () {
        page_index = 1;
        var date = Date.parse(new Date());
        this.setData({
            refreshTime: util.formatTime(date, 'h:m:s'),
        })
        this.getData();
    },
})