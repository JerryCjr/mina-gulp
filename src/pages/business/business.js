// pages/business/business.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let nodeList = '';
let teamTotalTarget = '';
Page({
  /**
   * 页面的初始数据
   */
    data: {
        dateRangeNumber: '',
        flag: false,
        types: '招生',
        types1: '个人',
        totalTarget: '',
        tableArr: ['时间', '节点目标', '您已完成', '节点完成率', '偏差'],
        promoter: [],
        nodeList: [],
        hiddenmodalput: true,
        recruitSum: '',
        nodeId: '',
        rangeId: '',
        flag1: false,
        teamNode: [],
        teamTotal: [],
        teamList: [],
        teamFlag: false,
        submiTime: '',
        hiddenremind: true,
        groupNum: ''
    },
    getInfo: function () {
        var that = this;
        ajax.GET({
            url: '/m/promoter/info3',
            success: function (res) {
                if (res.data.success) {
                    let nTime = new Date().getTime();
                    for (var i in res.data.data.nodeTargets) {
                        res.data.data.nodeTargets[i].times = i;
                        res.data.data.nodeTargets[i].time = util.formatTime(Number(i), 'Y/M/D');
                        if (res.data.data.nodeTargets[i].complete <= 0) {
                            res.data.data.nodeTargets[i].probability = 0 + '%';
                        } else {
                            res.data.data.nodeTargets[i].probability = (res.data.data.nodeTargets[i].complete / res.data.data.nodeTargets[i].target * 100).toFixed(2) + '%';
                            if (res.data.data.nodeTargets[i].target <= 0) {
                                res.data.data.nodeTargets[i].probability = 0 + '%';
                            }
                        }
                        if (res.data.data.nodeTargets[i].complete < 0) {
                            if (Number(i) - nTime >= 0 && Number(i) - nTime <= 172800000) {
                                res.data.data.nodeTargets[i].complete = '提交';
                                that.setData({
                                    hiddenremind: false
                                })
                            } else if (nTime > Number(i)) {
                                res.data.data.nodeTargets[i].complete = '未提交';
                            } else {
                                res.data.data.nodeTargets[i].complete = '待提交';
                            }
                        } 
                    }
                    if (res.data.data.teamNodeTargets) {
                        res.data.data.teamNodeTargets[i].time = util.formatTime(Number(i), 'Y/M/D');
                        if (res.data.data.nodeTargets[i].target === 0) {
                            res.data.data.nodeTargets[i].probability = 0 + '%';
                        } else {
                            if (res.data.data.teamNodeTargets[i].complete <= 0) {
                                res.data.data.teamNodeTargets[i].probability = 0 + '%';
                            } else {
                                res.data.data.teamNodeTargets[i].probability = (res.data.data.teamNodeTargets[i].complete / res.data.data.teamNodeTargets[i].target * 100).toFixed(2) + '%';
                            }
                        }
                        
                    }
                    if (res.data.data.promoter.leaderType === 1) {
                        that.setData({
                            tableArr: ['时间', '节点目标', '小组已完成', '节点完成率', '偏差']
                        })
                    }
                    nodeList = res.data.data.nodeTargets;
                    teamTotalTarget = res.data.data.teamTotalTarget;
                    that.setData({
                        promoter: res.data.data.promoter,
                        dateRangeNumber: res.data.data.dateRangeNumber,
                        totalTarget: res.data.data.totalTarget ? res.data.data.totalTarget : 0,
                        nodeList: res.data.data.nodeTargets,
                        rangeId: res.data.data.dateRangeId,
                        teamNode: res.data.data.teamNodeTargets ? res.data.data.teamNodeTargets : '',
                        groupNum: res.data.data.num ? res.data.data.num : 0
                    })

                } else {
                    wx.showToast({
                        title: res.data.msg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                    that.setData({
                        promoter: '',
                        dateRangeNumber: '',
                        totalTarget: '',
                        nodeList: '',
                        rangeId: ''
                    })
                }
            },
            fail: function(err) {
              console.log(err)
            }
        })
    },
    getSale: function () {
        let that = this;
        ajax.GET({
            url: '/m/promoter/sale',
            success: function (res) {
                if (res.data.success) {
                    for (var i in res.data.data.nodeTargets) {
                        res.data.data.nodeTargets[i].times = i;
                        res.data.data.nodeTargets[i].time = util.formatTime(Number(i), 'Y/M/D');
                        if (res.data.data.nodeTargets[i].target === 0) {
                            res.data.data.nodeTargets[i].probability = 0 + '%';
                        } else {
                            if (res.data.data.nodeTargets[i].complete <= 0) {
                                res.data.data.nodeTargets[i].probability = 0 + '%';
                            } else {
                                res.data.data.nodeTargets[i].probability = (res.data.data.nodeTargets[i].complete / res.data.data.nodeTargets[i].target * 100).toFixed(2) + '%';
                            }
                        }
                        
                    }
                    for (var i in res.data.data.teamNodeTargets) {
                        res.data.data.teamNodeTargets[i].times = i;
                        res.data.data.teamNodeTargets[i].time = util.formatTime(Number(i), 'Y/M/D');
                        if (res.data.data.nodeTargets[i].target === 0) {
                            res.data.data.nodeTargets[i].probability = 0 + '%';
                        } else {
                            if (res.data.data.teamNodeTargets[i].complete == 0) {
                                res.data.data.teamNodeTargets[i].probability = 0 + '%';
                            } else {
                                res.data.data.teamNodeTargets[i].probability = (res.data.data.teamNodeTargets[i].complete / res.data.data.teamNodeTargets[i].target * 100).toFixed(2) + '%';
                            }
                        }
                        
                        
                    }
                    that.setData({
                        rangeId: res.data.data.dateRangeId
                    })
                    if (that.data.types1 === '个人') {
                        that.setData({
                            dateRangeNumber: res.data.data.dateRangeNumber,
                            totalTarget: res.data.data.totalTarget,
                            nodeList: res.data.data.nodeTargets,
                        })
                    } else {
                        that.setData({
                            dateRangeNumber: res.data.data.dateRangeNumber,
                            totalTarget: res.data.data.teamTotalTarget,
                            nodeList: res.data.data.teamNodeTargets,
                            rangeId: res.data.data.dateRangeId,
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                    that.setData({
                        dateRangeNumber: '',
                        totalTarget: '',
                        nodeList: ''
                    })
                }
            },
            fail: function(err) {
              console.log(err)
            }
        })
    },
    showFun: function () {
        this.setData({
            flag: !this.data.flag
        })
    },
    showFun1: function () {
        this.setData({
            flag1: !this.data.flag1
        })
    },
    typeFun: function (e) {
        let types = e.target.dataset.type;
        let that = this;
        if (this.data.types1 === '小队') {
            if (types === '0') {
                this.setData({
                    types: '招生',
                    tableArr: ['时间', '节点目标', '小队已完成', '节点完成率', '偏差'],
                    nodeList: that.data.teamNode,
                    totalTarget: teamTotalTarget
                })
            } else {
                this.setData({
                    types: '销售',
                    tableArr: ['时间', '节点目标', '小队已完成', '当期完成率', '偏差'],
                })
                this.getSale();
            }
        } else {
            if (types === '0') {
                if (that.data.promoter.leaderType === 1) {
                    that.setData({
                        types: '招生',
                        tableArr: ['时间', '节点目标', '小组已完成', '节点完成率', '偏差'],
                        teamFlag: false
                    })
                } else {
                    this.setData({
                        types: '招生',
                        tableArr: ['时间', '节点目标', '您已完成', '节点完成率', '偏差']
                    })
                }
                this.getInfo();
            } else {
                if (that.data.promoter.leaderType === 1) {
                    that.setData({
                        types: '销售',
                        tableArr: ['时间', '节点目标', '小组已完成', '节点完成率', '当期完成率', '当期转化率', '偏差'],
                        teamFlag: true
                    })
                } else {
                    this.setData({
                        types: '销售',
                        tableArr: ['时间', '节点目标', '您已完成', '节点完成率', '偏差']
                    })
                }
                this.getSale();
            }
        }
        
    },
    typeFun1: function (e) {
        let that = this;
        let types = e.target.dataset.type;
        if (this.data.types === '销售') {
            if (types === '0') {
                this.setData({
                    types1: '个人',
                    tableArr: ['时间', '节点目标', '您已完成', '节点完成率', '偏差'],
                    nodeList: nodeList
                })
                this.getSale();
            } else {
                this.setData({
                    types1: '小队',
                    tableArr: ['时间', '节点目标', '小队已完成', '当期完成率', '偏差'],
                })
                this.getSale();
            }
        } else {
            if (types === '0') {
                this.setData({
                    types1: '个人',
                    tableArr: ['时间', '节点目标', '您已完成', '节点完成率', '偏差'],
                    nodeList: nodeList
                })
            } else {
                this.setData({
                    types1: '小队',
                    tableArr: ['时间', '节点目标', '小队已完成', '节点完成率', '偏差'],
                    nodeList: that.data.teamNode,
                    totalTarget: teamTotalTarget
                })   
            }
        }
    },
    submitFun: function (e) {
        let that = this;
        let t = e.target.dataset.remain;
        let m = e.target.dataset.time;
        let times = e.target.dataset.times;
        this.setData({
            nodeId: e.target.dataset.node
        })
        if (times - new Date().getTime() >= 0 && times - new Date().getTime() <= 172800000) {
            that.setData({
                hiddenmodalput: false,
            })
        }
        if (t === '待提交') {
            wx.showModal({
                title: '提示',
                content: '未到提交日期，请您于' + m + '日提交',
            })
        } else if (t === '提交') {
            this.setData({
                hiddenmodalput: false,
                submiTime: m
            })
        } else if (t === '未提交') {
            this.setData({
                hiddenmodalput: true
            })
            wx.showModal({
                title: '提示',
                content: '已超过提交日期，无法继续提交',
            })
        }
        
    },
    checkRecruit: function (e) {
        this.setData({
            recruitSum: e.detail.value
        })
    },
    //取消按钮  
    cancel: function () {
        this.setData({
            hiddenmodalput: true
        });
    },
    //取消弹框按钮  
    cancelRemind: function () {
        this.setData({
            hiddenremind: true
        });
    },
    //确认  
    confirm: function () {
        let that = this;
        let recruitSum = this.data.recruitSum;
        let para = {
            date_range_id: this.data.rangeId,
            date_node_id: this.data.nodeId,
            number: recruitSum
        }
        this.setData({
            hiddenmodalput: true
        })
        ajax.POST({
            url: '/m/promoter/enroll',
            data: para,
            success: function (res) {
                if (res.data.success) {
                    wx.showToast({
                        title: '提交成功',
                        color: '#fff',
                        duration: 2000
                    })
                    that.getInfo();
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: function(err) {
              console.log(err)
            }
        })
    },
    navTo: function (e) {
        app.globalData.dateTime = e.currentTarget.dataset.times;
        app.globalData.leaderType = this.data.promoter.leaderType;
        app.globalData.dateRangeId = this.data.rangeId;
        if (this.data.types === '招生') {
            app.globalData.types = 'enroll';
        } else {
            app.globalData.types = 'sale';
        }
        wx.navigateTo({
            url: './proMember'
        })
    },
    groupTo: function () {
        let that = this;
        wx.navigateTo({
            url: './groupMember?date_range_number=' + that.data.dateRangeNumber + '&id=' + that.data.promoter.id
        })
    },
    groupTo1: function () {
        let that = this;
        wx.navigateTo({
            url: './teamMember?date_range_number=' + that.data.dateRangeNumber + '&id=' + that.data.promoter.id
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInfo();
    }
})