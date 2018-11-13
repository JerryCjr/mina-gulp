// pages/salary/salary.js
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
        list: [],
        hideBottom: true,
        loadMoreData: '加载更多…',
        refreshTime: '', // 刷新的时间
        totalCount: 0,
        id: 0
    },
    getData: function (id) {
        wx.showLoading({
            title: '加载中…',
        });
        var that = this;
        let pageIndex = page_index;
        let url = '';
        // 判断身份ID分别请求接口
        if (id === '2') {
            url = '/m/promoter/salary/list' // 顾问工资接口
        } else {
            url = '/m/ambassador/salary/list' // 大使工资接口
        }
        ajax.GET({
            url: url,
            success: function (res) {
                let list = [];
                if (res.data.success) {
                    wx.hideLoading();
                    let data = res.data.data;
                    if (data && data.items && data.items.length) {
                        // map 换算金额
                        list = data.items.map(function (item) {
                            item.entity.amount = (item.entity.amount / 100).toFixed(2);
                            return item;
                        })
                        that.setData({
                            totalCount: data.totalCount,
                            list: list
                        })
                        if (data.totalPage === 1) {
                            that.setLoadFun(that, '已经到顶', false, list);
                        } else {
                            if (pageIndex == 1) { // 下拉刷新
                                totalPage = data.totalPage;
                                that.setLoadFun(that, '加载更多…', true, list);
                            } else { // 上拉加载
                                let tempArray = that.data.list;
                                tempArray = tempArray.concat(list);
                                totalPage = data.totalPage;
                                that.setLoadFun(that, '加载更多…', true, tempArray);
                            }
                        }
                    } else {
                        wx.showToast({
                            title: '暂无数据',
                            color: '#fff',
                            icon: 'none',
                            duration: 2000
                        })
                        that.setLoadFun(that, '已经到顶', false, []);
                    }
                } else {
                    wx.hideLoading();
                    app.catchFunc(res);
                }
            },
            fail: function (err) {
                wx.hideLoading();
                console.log(err);
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
            self.setLoadFun(self, '已经到顶', false);
            return;
        }
        page_index++;
        self.setLoadFun(self, '加载更多…', false);
        self.getData(self.data.id);
    },
    navTo: function (e) {
        app.globalData.salaryId = e.currentTarget.dataset.id;
        app.globalData.salaryDate = e.currentTarget.dataset.name;
        wx.navigateTo({
            url: '/pages/salary/salaryInfo?id=' + this.data.id,
        })
    },
    /**
     * 公用函数
     * @function
     */

    setLoadFun: function (that, load, bool, list) {
        if (list) {
            that.setData({
                loadMoreData: load, // 底部加载话语
                hideBottom: bool, // 是否显示底部
                list: list // 列表
            })
        } else {
            that.setData({
                loadMoreData: load, // 底部加载话语
                hideBottom: bool, // 是否显示底部
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({ id: options.id })
        this.getData(options.id);
        var date = Date.parse(new Date());
        this.setData({
            refreshTime: util.formatTime(date, 'h:m:s'),
            refreshTime1: util.formatTime(date, 'h:m:s'),
        })
    },
})