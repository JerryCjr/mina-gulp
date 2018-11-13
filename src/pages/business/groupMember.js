// pages/business/groupMember.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let page_size = 20;
let page_index = 1;
let totalPage = 0;

const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1; i <= 12; i++) {
    months.push(i)
}

for (let i = 1; i <= 31; i++) {
    days.push(i)
}

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
        showModal: false,
        showModal1: false,
        showFlag: false,
        modalName: '',
        actionSheetHidden: true,
        actionSheetItems: ['主动申请', '辞退', '失联'],
        reasons: '主动申请',
        pro_type: 0,
        pro_id: '',
        cause: '',
        years: years,
        year: date.getFullYear(),
        months: months,
        month: date.getMonth() + 1,
        days: days,
        day: date.getDate(),
        value: [9999, date.getMonth(), date.getDate() - 1],
        pickerShow: false
    },

    bindChange: function (e) {
        const val = e.detail.value
        this.setData({
            year: this.data.years[val[0]],
            month: this.data.months[val[1]],
            day: this.data.days[val[2]]
        })
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
                    if (dataModel.totalPage === 1) {
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

    checkCause: function (e) {
        this.setData({
            cause: e.detail.value
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

    dimissionFun: function (e) {
        console.log(e)
        let item = e.currentTarget.dataset.item;
        if (item.leadTeamName) {
            // 提示 1
            wx.showModal({
                title: '提示',
                content: '此成员属于小队队长，请和总部联系更换小队长后申请离职',
            })
            return;
        }
        if (item.stat === 0) {
            // 提示 2
            wx.showModal({
                title: '提示',
                content: '此人将于' + util.formatTime(item.leaveDate, 'M月D日') + '离职，若需要取消离职，请联系总部',
            })
            return;
        }
        this.setData({
            showModal: true,
            showFlag: true,
            modalName: item.nickname,
            pro_id: item.id
        })
    },

    leaveFun: function (e) {
        let item = e.currentTarget.dataset.item;
        if (item.stat === 2) {
            if (item.number === this.data.range_number) {
                return
            } else {
                // 提示 1
                wx.showModal({
                    title: '提示',
                    content: '此成员已申请下期请假，若需要取消请假，请联系总部',
                })
                return;
            }
        }
        this.setData({
            showModal1: true,
            showFlag: true,
            modalName: item.nickname,
            pro_id: item.id
        })
    },

    cancelFun: function () {
        this.setData({
            showModal: false,
            showModal1: false,
            showFlag: false,
        })
    },

    saveFun: function () {
        let that = this;
        let myDate = new Date();
        myDate.setFullYear(this.data.year, this.data.month - 1, this.data.day);
        let times = Date.parse(myDate);
        console.log(this.data.cause)
        let para = {
            pro_id: this.data.pro_id,
            leave_type: this.data.pro_type,
            leave_reason: this.data.cause,
            leave_date: times
        }
        ajax.POST({
            url: '/m/promoter/leave',
            data: para,
            success: function (res) {
                if (res.data.success) {
                    wx.showToast({
                        title: '提交成功',
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                    that.getData();
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
        this.setData({
            showModal: false,
            showFlag: false,
            pickerShow: false
        })
    },

    saveFun1: function () {
        let that = this;
        let para = {
            pro_id: this.data.pro_id,
        }
        ajax.POST({
            url: '/m/promoter/vacation',
            data: para,
            success: function (res) {
                if (res.data.success) {
                    wx.showToast({
                        title: '提交成功',
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                    that.getData();
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
        this.setData({
            showModal1: false,
            showFlag: false,
        })
    },

    listenerButtonCause: function () {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },

    choiceCause: function (e) {
        if (e.currentTarget.dataset.resonse === '主动申请') {
            this.setData({
                pro_type: 0
            })
        } else if (e.currentTarget.dataset.resonse === '辞退') {
            this.setData({
                pro_type: 1
            })
        } else {
            this.setData({
                pro_type: 2
            })
        }
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden,
            reasons: e.currentTarget.dataset.resonse
        })
    },

    listenerActionSheet: function () {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },

    listenerButtonDate: function () {
        this.setData({
            pickerShow: !this.data.pickerShow
        })
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