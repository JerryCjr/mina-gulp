// pages/personal/personal.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let page_size = 20;
let page_index = 1;
let totalPage = 0;
let page_size1 = 20;
let page_index1 = 1;
let totalPage1 = 0;
let flag = true;
Page({

  /**
   * 页面的初始数据
   */
    data: {
        personalList: [],
        personalPastList: [],
        wechatName: '',
        photo: '',
        flag: false,
        active: false,
        hideBottom: true,
        loadMoreData: '加载更多……',
        refreshTime: '', // 刷新的时间
        hideBottom1: true,
        loadMoreData1: '加载更多……',
        refreshTime1: '', // 刷新的时间
        totalCount: 0,
        is_default_order: 1,
        ascend: '',
        orderFlag1: false,
        orderFlag2: false,
    },
    getData: function (idx) {
        var that = this;
        let pageIndex = page_index;
        let params = {};
        if (idx === 0 || idx === 1) {
            params = {
                page_size: page_size,
                page_index: 1,
                wechat: this.data.wechatName,
                is_default_order: 0,
                ascend: idx
            }
            // that.setData({
            //     is_default_order: 0,
            //     ascend: idx,
            //     page_index: 1
            // })
        } else {
            params = {
                page_size: page_size,
                page_index: page_index,
                wechat: this.data.wechatName,
                is_default_order: this.data.is_default_order,
                ascend: this.data.ascend
            }
        }
        
        ajax.GET({
            url: '/m/promoter/list_users',
            data: params,
            success: function (res) {
                let personalList = '';
                let dataModel = res.data.data;
                if (res.data.success && res.data.data.items && res.data.data.items.length) {
                    that.setData({
                        totalCount: dataModel.totalCount
                    })
                    personalList = res.data.data.items.map(function (item) {
                        if (item.entity.photo) {
                            item.entity.photo = JSON.parse(item.entity.photo).photo
                        }
                        if (item.entity.wechatName) {
                            item.entity.wechatName = item.entity.wechatName.replace(/[\n]/g, "");
                        } else {
                            item.entity.wechatName = '';
                        }
                        item.entity.wechatName = item.entity.wechatName.replace(/[\n]/g, "");
                        item.entity.bindTime = util.formatTime(item.entity.bindTime,'Y/M/D h:m');
                        return item;
                    })
                    if (dataModel.totalPage === 1) {
                        that.setData({
                            loadMoreData: '已经到顶',
                            hideBottom: false,
                            personalList: personalList,
                        })
                    } else {
                        if (pageIndex == 1) { // 下拉刷新
                            totalPage = dataModel.totalPage;
                            that.setData({
                                personalList: personalList,
                                hideBottom: true,
                            })
                        } else { // 上拉加载
                            let tempArray = that.data.personalList;
                            tempArray = tempArray.concat(personalList);
                            totalPage = dataModel.totalPage;
                            that.setData({
                                personalList: tempArray,
                                hideBottom: true,
                            })
                        }
                    }
                } else {
                    app.catchFunc(res, 'personal');
                    that.setData({
                        personalList: [],
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
    orderFun: function () {
        if (flag) {
            this.getData(0);
            flag = false;
            this.setData({
                orderFlag1: true,
                orderFlag2: false,
            })
        } else {
            this.getData(1);
            flag = true;
            this.setData({
                orderFlag1: false,
                orderFlag2: true,
            })
        }
    },
    openFun: function () {
        let that = this;
        let personalPastList = '';
        let pageIndex = page_index1;
        this.setData({
            flag: true
        });
        ajax.GET({
            url: '/m/promoter/list_expire',
            success: function (res) {
                let dataModel = res.data.data;
                if (res.data.success && res.data.data.items && res.data.data.items.length) {
                    personalPastList = res.data.data.items.map(function (item) {
                        item.entity.photo = JSON.parse(item.entity.photo).photo;
                    // item.entity.expTime = util.formatTime(item.entity.expTime, 'Y/M/D h:m');
                        return item;
                    })
                    if (dataModel.totalPage === 1) {
                        that.setData({
                            loadMoreData1: '已经到顶',
                            hideBottom1: false,
                            personalPastList: personalPastList
                        })
                    } else {
                        if (pageIndex == 1) { // 下拉刷新
                            totalPage = dataModel.totalPage;
                            that.setData({
                                personalPastList: personalPastList,
                                hideBottom: true,
                            })
                        } else { // 上拉加载
                            let tempArray = that.data.personalPastList;
                            tempArray = tempArray.concat(personalPastList);
                            totalPage = dataModel.totalPage;
                            that.setData({
                                personalPastList: tempArray,
                                hideBottom1: true,
                            })
                        }
                    }
                } else {
                    that.setData({
                        personalPastList: [],
                        hideBottom1: false,
                        loadMoreData1: '已经到顶',
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
    closeFun: function () {
        this.setData({
            flag: false
        })
    },
    checkWx: function (e) {
        this.setData({
            wechatName: e.detail.value
        })
    },
    searchFun: function () {
        page_size = 10;
        page_index = 1;
        this.getData();
    },
    showAll: function (e) {
        this.setData({
            active: true
        })
    },
    hideAll: function (e) {
        this.setData({
            active: false
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
            self.getData();
        }, 0);
    },
    loadMore1: function () {
        var self = this;
        // 当前页是最后一页
        if (page_index1 >= totalPage1) {
            self.setData({
                loadMoreData1: '已经到顶',
                hideBottom1: false,
            })
            return;
        }
        setTimeout(function () {
            let tempCurrentPage = page_index1;
            tempCurrentPage++;
            page_index1 = tempCurrentPage;
            self.setData({
                hideBottom1: false
            })
            self.openFun();
        }, 0);
    },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        page_index = 1;
        var date = Date.parse(new Date());
        this.setData({
            refreshTime: util.formatTime(date, 'h:m:s'),
            refreshTime1: util.formatTime(date, 'h:m:s')
        })
        this.getData();
    },

    studentDetailInfo: function(e) {
        var user_id = e.currentTarget.dataset.userId;
        var user_time = e.currentTarget.dataset.userTime;
        wx.navigateTo({
            url: '/pages/personal/detail?user_id=' + user_id,
        })
    }
})