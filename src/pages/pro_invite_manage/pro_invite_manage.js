// pages/pro_invite_manage/pro_invite_manage.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let page_size = 20;
let page_index = 1;
let totalPage = 0;
let count = 0;
let id = 0;
let current = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        flag: true,
        bgFlag: true,
        list: [],
        totalCount: 0,
        loadMoreData: '加载更多……',
        hideBottom: true,
        id: 0,
        activeIdx: 0,
        wechatName: ''
    },

    searchFun: function () {
        this.getList();
    },

    navFun: function (e) {
        current = e.currentTarget.dataset.idx;
        page_index = 1;
        this.setData({
            activeIdx: current,
        });
        this.getList();
    },

    checkWx: function (e) {
        this.setData({
            wechatName: e.detail.value
        })
        
    },

    getList: function () {
        let that = this;
        this.setData({ bgFlag: false });
        let url = '';
        let pageIndex = page_index;
        let dataModel = '';
        let para = {
            page_size: page_size,
            page_index: page_index,
            wechat: this.data.wechatName,
        }
        if (id == 0) {
            if (current == 0) {
                url = '/promoter/invite/pro/list'
            } else {
                url = '/promoter/invite/amb/list'
            }
            
        } else {
            url = '/m/ambassador/get_invites'
        }
        ajax.GET({
            url: url,
            data: para,
            success: function (res) {
                let list = '';
                dataModel = res.data.data;
                console.log(dataModel.totalPage)
                if (res.data.success && res.data.data.items && res.data.data.items.length) {
                    that.setData({ flag: true, bgFlag: true });
                    totalPage = dataModel.totalPage;
                    list = res.data.data.items.map(function (item) {
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
                        console.log(item)
                    })
                    if (dataModel.totalPage === 1) {
                        that.setData({
                            loadMoreData: '已经到顶',
                            hideBottom: false,
                            list: list,
                        })
                    } else {
                        console.log(dataModel.totalPage)
                        if (pageIndex == 1) { // 下拉刷新
                            that.setData({
                                list: list,
                                hideBottom: true,
                            })
                        } else { // 上拉加载
                            let tempArray = that.data.list;
                            tempArray = tempArray.concat(list);
                            that.setData({
                                list: tempArray,
                                hideBottom: true,
                            })
                        }
                    }
                } else {
                    that.setData({
                        list: [],
                        flag: false,
                        bgFlag: true
                    })
                }
            }
        })
    },

    getCount: function (id) {
        console.log(id)
        let that = this;
        let para = {
            amb_id: id
        }
        ajax.GET({
            url: '/m/ambassador/get_binding_count',
            data: para,
            success: function (res) {
                if (res.data.success) {
                    return res.data.data;
                } else {
                    return '暂无数据';
                }
            }
        })
        
    },

    loadMore: function () {
        var self = this;
        // 当前页是最后一页
        console.log(totalPage)
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
                hideBottom: false,
            })
            self.getList();
        }, 0);
    },

    explainFun: function () {
        if(app.globalData.promoterType !== 6) {
          wx.navigateTo({
            url: '/pages/pro_explain/pro_explain',
          })
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(Number(options.activeIdx))
        console.log(options)
        page_index = 1;
        current = 0;
        id = options.id ? options.id : 0;
        let activeIdx = options.activeIdx ? options.activeIdx : 0;
        this.setData({ id: id, activeIdx: Number(activeIdx) });
    },

    onShow: function () {
        this.getList();
    }
})