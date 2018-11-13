// pages/punch_card/punch_card.js
// 尽量使用全局常量
// 重复的图片运用变量去记录 一旦产生修改不用多次去修改
// 标签使用“” 
// 命名清晰或者加注释
// 重复的逻辑进行封装
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let page_size = 20;
let page_index = 1;
let totalPage = 0;
let current = 0;
let arrId = [];
let nowDate = new Date();
let year = nowDate.getFullYear();
let month = nowDate.getMonth() + 1;
let day = nowDate.getDate();
let times = util.formatTimeTwo(year + '-' + month + '-' + day);
let stat = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        activeIdx: 0,
        loadMoreData: '加载更多……',
        refreshTime: '',
        list: '',
        totalCount: 0,
        totalCount1: 0,
        classNumber: 0,
        punchCard: 0,
        count: 0,
        flag: true,
        onClassFlag1: true,
        onClassFlag2: true,
        audit: false,
        date: '选择时间',
        dialog: false,
        fontLen: 0,
        userInput: '',
        checkTotalCount: 0,
        selectPicUrl: 'https://i.s.babyfs.cn/op/1/fed7bec811e84f29ad35536e29515601.png',
        noselectPicUrl: 'https://i.s.babyfs.cn/op/1/3abad682b8ca4441b59fc0a0a7328e4c.png',
    },

    bindChange: function (e) {
        current = e.detail.current;
        page_index = 1;
        totalPage = 0;
        this.setData({
            activeIdx: current,
            list: [],
            loadMoreData: '加载更多……',
            audit: false,
            onClassFlag1: true,
            onClassFlag2: true,
        });
        if (current === 0 || current === 1) {
            this.getCount();
            this.getData(current);
        } else {
            this.getStatistics();
        }
    },

    navFun: function (e) {
        current = e.currentTarget.dataset.idx;
        page_index = 1;
        this.setData({
            activeIdx: current,
        });
    },

    getData: function (idx) {
        let that = this;
        let para = {};
        para = {
            page_size: page_size,
            page_index: page_index,
        }
        if (idx == 0) {
            para['STATE'] = idx;
        } else {
            para['is_approval'] = 1;
        }
        ajax.GET({
            url: '/m/promoter/center_wxx/pro_check_in_list',
            data: para,
            success: function (res) {
                let list = [];
                let dataModel = res.data.data;
                if (res.data.success) {
                    if (res.data.data.items && res.data.data.items.length) {
                        list = res.data.data.items.map(function (item) {
                            let t = item.uploadTime + '';
                            item.uploadTime = t.slice(0, 4) + '-' + t.slice(4, 6) + '-' + t.slice(6);
                            item.flag = false;
                            return item;
                        })
                        that.setData({
                            totalCount: dataModel.totalCount
                        })
                        that.commonLoadlogFun(dataModel, list);
                    } else {
                        that.commonFalseFun();
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

    getStatistics: function (idx) {
        let that = this;
        let para = {
            page_size: page_size,
            page_index: page_index,
            date_time: times,
            type: idx ? idx : 0  // 默认参数
        }
        ajax.GET({
            url: '/m/promoter/center_wxx/pro_all_user_list',
            data: para,
            success: function (res) {
                let list = '';
                let dataModel = res.data.data;
                if (res.data.success) {
                    if (res.data.data.items && res.data.data.items.length) {
                        list = res.data.data.items.map(function (item) {
                            if (item.entity.photo) {
                                let ph = JSON.parse(item.entity.photo);
                                if (ph.wxHeadImg) {
                                    item.entity.photo = ph.wxHeadImg;
                                } else {
                                    item.entity.photo = ph.photo;
                                }

                            } else {
                                item.entity.photo = ''
                            }
                            return item;
                        })
                        that.setData({
                            totalCount1: dataModel.totalCount
                        })
                        that.commonLoadlogFun(dataModel, list);
                    } else {
                        that.commonFalseFun();
                    }
                } else {
                    that.commonFalseFun();
                    app.catchFunc(res);
                }
            },
            fail: function (err) {
                console.log(err);
                wx.showModal({
                    title: '错误',
                    content: err.errMsg,
                    showCancel: false
                })
            }
        })
    },

    // 统计打卡数
    getCount: function () {
        let that = this;
        wx.showLoading({
            title: '加载中...'
        })
        ajax.GET({
            url: '/m/promoter/center_wxx/check_in_statistics',
            success: function (res) {
                if (res.data.success) {
                    let data = res.data.data;
                    that.setData({
                        punchCard: data.currentCheckInNum ? data.currentCheckInNum : 0, // 判断为空情况
                        classNumber: data.currentTakeCourseNum ? data.currentTakeCourseNum : 0
                    })
                    wx.hideLoading();
                } else {
                    wx.hideLoading();
                    app.catchFunc(res);
                }
            },
            // 增加fail
            fail: function (err) {
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
        this.commonLoadFun();
    },
    
    navTo: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/punch_card/student_punch_card?user_id=' + id,
        })
    },

    selectedFun: function () {
        let that = this; 
        page_index = 1;
        let flag = that.data.flag
        let list = this.data.list;
        list.map((item) => {
            item.flag = flag;
            return item;
        })
        this.setData({
            flag: !flag,
            list: list
        })
        if (flag) {
            this.setData({
                count: that.data.list.length
            })
        } else {
            this.setData({
                count: 0
            })
        }
    },

    selectedFun2: function () {
        let that = this;
        page_index = 1;
        totalPage = 0;
        this.setData({
            list: [],
            onClassFlag1: !that.data.onClassFlag1,
        })
        if (!this.data.onClassFlag2) {
            this.setData({
                onClassFlag2: true
            })
        }
        if (!this.data.onClassFlag1) {
            stat = 2;
            this.getStatistics(2);
        } else if (this.data.onClassFlag1 && this.data.onClassFlag2) {
            stat = 0;
            this.getStatistics(0);
        } else {
            stat = 1;
            this.getStatistics(1);
        }
    },

    selectedFun3: function () {
        let that = this;
        page_index = 1;
        totalPage = 0;
        this.setData({
            list: [],
            onClassFlag2: !that.data.onClassFlag2,
        })
        if (!this.data.onClassFlag1) {
            this.setData({
                onClassFlag1: true
            })
        }
        if (!this.data.onClassFlag2) {
            stat = 1;
            this.getStatistics(1);
        } else if (this.data.onClassFlag1 && this.data.onClassFlag2) {
            stat = 0;
            this.getStatistics(0);
        } else {
            stat = 2;
            this.getStatistics(2);
        }
    },

    bindDateChange: function (e) {
        console.log(util.formatTimeTwo(e.detail.value))
        console.log('picker发送选择改变，携带值为', e.detail.value)
        times = util.formatTimeTwo(e.detail.value);
        page_index = 1;
        let para = {
            page_size: page_size,
            page_index: page_index,
            date_time: times
        }
        this.setData({
            date: e.detail.value,
            list: []
        })
        this.getStatistics(stat);
    },

    checkFun: function () {
        this.setData({
            audit: true
        })
    },

    selectRep: function (e) {
        if (this.data.audit) {
            let index = e.currentTarget.dataset.selectindex;  //当前点击元素的自定义数据
            let list = this.data.list;    //取到data里的selectIndex
            list[index].flag = !list[index].flag;   //点击就赋相反的值
            let arr = [];
            list.map((item) => {
                if (item.flag) {
                    arr.push(item)
                }
            })
            this.setData({
                list: list, //将已改变属性的json数组更新
                count: arr.length
            })
            if (this.data.count != this.data.list.length) {
                this.setData({
                    flag: true
                })
            } else {
                this.setData({
                    flag: false
                })
            }
        } else {
            return;
        }
        
    },

    passFun: function (e) {
        arrId = [];
        let that = this;
        let stat = e.target.dataset.type;
        let list = this.data.list;
        list.map((item, idx) => {
            if (item.flag) {
                if (arrId.indexOf(item.id) == -1) {
                    arrId.push(item.id);
                }
            }
        })
        if (arrId.length == 0) {
            wx.showModal({
                title: '提示',
                content: '您还没有选择学员',
            })
        } else {
            // 可拿出审核不通过逻辑
            if (stat == 2) {
                this.setData({
                    dialog: true
                })
            } else {
                let para = {
                    ids: arrId.join(',')
                }
                wx.showModal({
                    title: '提示',
                    content: '确定审核通过吗？',
                    success: function (res) {
                        if (res.confirm) {
                            ajax.POST({
                                url: '/m/promoter/center_wxx/audit/pass',
                                data: para,
                                success: function (res) {
                                    if (res.data.success) {
                                        that.commonAduit('审核成功');
                                    } else {
                                        app.catchFunc(res);
                                    }
                                },
                                fail: function () {
                                    wx.showModal({
                                        title: '错误',
                                        content: err.errMsg,
                                        showCancel: false
                                    })
                                }
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
                
            }
        }
    },

    bindWordLimit: function (e) {
        let val = e.detail.value;
        this.setData({
            userInput: val,
            fontLen: val.length
        })
    },

    cancelFun: function () {
        this.setData({
            dialog: false
        })
    },

    saveFun: function () {
        console.log(this.data.userInput)
        let that = this;
        let resaon = this.data.userInput;
        let para = {
            ids: arrId.join(','),
            reason: resaon
        }
        ajax.POST({
            url: '/m/promoter/center_wxx/audit/unpass',
            data: para,
            success: function (res) {
                if (res.data.success) {
                    that.setData({
                        dialog: false
                    })
                    that.commonAduit('保存成功');
                } else {
                    app.catchFunc(res);
                }
            },
            fail: function (err) {
                console.log(err);
                wx.showModal({
                    title: '错误',
                    content: err.errMsg,
                    showCancel: false
                })
            }
        })
    },

    /**
     * 公用函数
     * @function
     */
    // 下拉加载公用函数
    commonLoadFun: function () {
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
        if (current === 2) {
            this.getStatistics(stat);
        } else {
            this.getData(current);
        }
    },

    // 下拉加载逻辑公用函数
    commonLoadlogFun: function (dataModel, list) {
        let that = this;
        if (dataModel.totalPage === 1) {
            that.setData({
                loadMoreData: '已经到顶',
                hideBottom: false,
                list: list
            })
        } else {
            if (page_index == 1) { // 下拉刷新
                totalPage = dataModel.totalPage;
                that.setData({
                    hideBottom: true,
                    list: list
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
    },

    // 列表加载失败公用函数
    commonFalseFun: function () {
        this.setData({
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
    },

    // 打卡审核数据初始
    commonAduit: function (title) {
        wx.showToast({
            title: title,
        })
        this.setData({ count: 0 });
        page_index = 1;
        this.getData(0);
        arrId = [];
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        stat = 0;
        page_index = 1;
        totalPage = 0;
        var date = Date.parse(new Date());
        this.setData({
            refreshTime: util.formatTime(date, 'h:m:s'),
        })
        this.getData(0);
    },
})