const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let page_size = 10;
let page_index = 1;
let totalPage = 0;
let flag = true;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        arrList: [],
        promember: [],
        station: '',
        hideBottom: true,
        loadMoreData: '加载更多……' ,
        refreshTime: '', // 刷新的时间 
        orderFlag1: true,
        orderFlag2: false,
        ascend: 0
    },
    getTeam: function (idx) {
        let that = this;
        let para = '';
        if (app.globalData.leaderType === 2 && app.globalData.types === 'enroll') {
            let pageIndex = page_index;
            that.setData({
                arrList: ['昵称', '分站号', '目标', '招生数', '偏差']
            })
            if (idx === 0 || idx === 1) {
                this.setData({
                    ascend: idx
                })
            }
            para = {
                station_number: this.data.station,
                page_size: page_size,
                page_index: page_index,
                // ascend: this.data.ascend
            }
            ajax.POST({
                url: '/m/promoter/enroll/team',
                data: para,
                success: function (res) {
                    let dataModel = res.data.data;
                    if (res.data.success && res.data.data.items && res.data.data.items.length) {
                        if (dataModel.totalPage === 1) {
                            that.setData({
                                loadMoreData: '已经到顶',
                                hideBottom: false,
                                promember: dataModel.items,
                            })
                        } else {
                            if (pageIndex == 1) { // 下拉刷新
                                totalPage = dataModel.totalPage;
                                that.setData({
                                    promember: dataModel.items,
                                    hideHeader: true
                                })
                            } else { // 上拉加载
                                let tempArray = that.data.promember;
                                tempArray = tempArray.concat(dataModel.items);
                                totalPage = dataModel.totalPage;
                                that.setData({
                                    promember: tempArray,
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
                            promember: [],
                            hideBottom: false,
                            loadMoreData: '已经到顶',
                        })
                    }
                }
            })
        } else if (app.globalData.leaderType === 2 && app.globalData.types === 'sale') {
            let pageIndex = page_index;
            if (idx === 0 || idx === 1) {
                this.setData({
                    ascend: idx
                })
            }
            para = {
                station_number: this.data.station,
                date_time: app.globalData.dateTime,
                date_range_id: app.globalData.dateRangeId,
                page_size: page_size,
                page_index: page_index,
                // ascend: this.data.ascend
            }
            that.setData({
                arrList: ['昵称', '分站号', '目标', '销售数', '偏差']
            })
            ajax.POST({
                url: '/m/promoter/sale/team',
                data: para,
                success: function (res) {
                    let dataModel = res.data.data;
                    if (res.data.success && res.data.data.items && res.data.data.items.length) {
                        if (dataModel.totalPage === 1) {
                            that.setData({
                                loadMoreData: '已经到顶',
                                hideBottom: false,
                                promember: dataModel.items,
                            })
                        } else {
                            if (pageIndex == 1) { // 下拉刷新
                                totalPage = dataModel.totalPage;
                                that.setData({
                                    promember: dataModel.items,
                                    hideHeader: true
                                })
                            } else { // 上拉加载
                                let tempArray = that.data.promember;
                                tempArray = tempArray.concat(dataModel.items);
                                totalPage = dataModel.totalPage;
                                that.setData({
                                    promember: tempArray,
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
                            promember: [],
                            hideBottom: false,
                            loadMoreData: '已经到顶',
                        })
                    }
                }
            })
        } else if (app.globalData.leaderType === 1 && app.globalData.types === 'enroll') {
            let pageIndex = page_index;
            that.setData({
                arrList: ['昵称', '分站号', '目标', '招生数', '偏差'],
            })
            if (idx === 0 || idx === 1) {
                this.setData({
                    ascend: idx
                })
            }
            para = {
                station_number: this.data.station,
                page_size: page_size,
                page_index: page_index,
                // ascend: this.data.ascend
            }
            ajax.POST({
                url: '/m/promoter/enroll/group',
                data: para,
                success: function (res) {
                    let dataModel = res.data.data;
                    if (res.data.success && res.data.data.items && res.data.data.items.length) {
                        if (dataModel.totalPage === 1) {
                            that.setData({
                                loadMoreData: '已经到顶',
                                hideBottom: false,
                                promember: dataModel.items,
                            })
                        } else {
                            if (pageIndex == 1) { // 下拉刷新
                                totalPage = dataModel.totalPage;
                                that.setData({
                                    promember: dataModel.items,
                                    hideHeader: true
                                })
                            } else { // 上拉加载
                                let tempArray = that.data.promember;
                                tempArray = tempArray.concat(dataModel.items);
                                totalPage = dataModel.totalPage;
                                that.setData({
                                    promember: tempArray,
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
                            promember: [],
                            hideBottom: false,
                            loadMoreData: '已经到顶',
                        })
                    }
                }
            })
        } else if (app.globalData.leaderType === 1 && app.globalData.types === 'sale') {
            let pageIndex = page_index;
            that.setData({
                arrList: ['昵称', '分站号', '目标', '销售数', '偏差'],
            })
            if (idx === 0 || idx === 1) {
                this.setData({
                    ascend: idx
                })
            }
            para = {
                station_number: this.data.station,
                page_size: page_size,
                page_index: page_index,
                date_time: app.globalData.dateTime,
                date_range_id: app.globalData.dateRangeId,
                // ascend: this.data.ascend
            }
            ajax.POST({
                url: '/m/promoter/sale/group',
                data: para,
                success: function (res) {
                    let dataModel = res.data.data;
                    if (res.data.success && res.data.data.items && res.data.data.items.length) {
                        if (dataModel.totalPage === 1) {
                            that.setData({
                                loadMoreData: '已经到顶',
                                hideBottom: false,
                                promember: dataModel.items,
                            })
                        } else {
                            if (pageIndex == 1) { // 下拉刷新
                                totalPage = dataModel.totalPage;
                                that.setData({
                                    promember: dataModel.items,
                                    hideHeader: true
                                })
                            } else { // 上拉加载
                                let tempArray = that.data.promember;
                                tempArray = tempArray.concat(dataModel.items);
                                totalPage = dataModel.totalPage;
                                that.setData({
                                    promember: tempArray,
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
                            promember: [],
                            hideBottom: false,
                            loadMoreData: '已经到顶',
                        })
                    }
                }
            })
        }
    },
    checkStation: function (e) {
        this.setData({
            station: e.detail.value
        })
    },
    searchFun: function () {
        page_size = 10;
        page_index = 1;
        this.getTeam();
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
            self.getTeam();
        }, 0);
    },
    orderFun: function () {
        if (flag) {
            flag = false;
            this.setData({
                orderFlag1: false,
                orderFlag2: true,
            })
            this.getTeam(1);
        } else {
            flag = true;
            this.setData({
                orderFlag1: true,
                orderFlag2: false,
            })
            this.getTeam(0);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var date = Date.parse(new Date());
        this.setData({
            refreshTime: util.formatTime(date, 'h:m:s')
        })
        this.getTeam();
    }
})