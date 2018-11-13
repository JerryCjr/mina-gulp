// pages/pro_invite_manage/pro_invite_manage.js
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
        state: false,
        first_click: false,
        hideBottom: true,
        loadMoreData: '加载更多……',
        refreshTime: '', // 刷新的时间
        totalCount: 0,
        personalList: [],
        wechatName: '',
        id: -1,
        canChange: false
    },

    checkWx: function (e) {
        this.setData({
            wechatName: e.detail.value
        })
        this.getData();
    },

    toggle: function (e) {
        if(!this.data.canChange) {
            this.setData({
                canChange: true
            })
        }
        if (this.data.id == e.currentTarget.dataset.idx) {
            this.setData({
                id: -1
            });
        } else {
            this.setData({
                id: e.currentTarget.dataset.idx
            });
        }
    },

    getData: function (idx) {
        var that = this;
        let pageIndex = page_index;
        let params = {
            page_size: page_size,
            page_index: page_index,
            wechat: this.data.wechatName,
        }

        ajax.GET({
            url: '/m/ambassador/get_users',
            data: params,
            success: function (res) {
                let personalList = '';
                let dataModel = res.data.data;
                if (res.data.success && res.data.data.items && res.data.data.items.length) {
                    that.setData({
                        totalCount: dataModel.totalCount
                    })
                    personalList = res.data.data.items.map(function (item, idx) {
                        if (item.photo) {
                            let ph = JSON.parse(item.photo);
                            if (ph.wxHeadImg) {
                                item.photo = ph.wxHeadImg;
                            } else {
                                item.photo = ph.photo;
                            }

                        } else {
                            item.photo = ''
                        }
                        return item;
                    })
                    console.log(personalList)
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
                    app.catchFunc(res, 'pro_personal');
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



    explainFun: function () {
        wx.navigateTo({
            url: '/pages/pro_explain/recruit_explain',
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        page_index = 1;
        var date = Date.parse(new Date());
        this.setData({
            refreshTime: util.formatTime(date, 'h:m:s'),
        })
        this.getData();
    },
})