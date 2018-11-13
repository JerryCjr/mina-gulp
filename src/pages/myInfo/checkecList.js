const app = getApp();
let ajax = require('../../utils/ajax.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        secList: [],
        showFlag: false,
        id: '',
        remark: '',
        remark1: '',
        remarks: '',
        promoter: '',
        photo: ''
    },
    getInfo: function () {
        var that = this;
        ajax.GET({
            url: '/m/promoter/info3',
            success: function (res) {
                if (res.data.success) {
                    that.setData({
                        promoter: res.data.data.promoter,
                        photo: res.data.data.user.photo,
                        stat: res.data.data.promoter.sendStat,
                    })
                    if (res.data.data.promoter.remark == 'null' || res.data.data.promoter.remark == 'undefined') {
                        that.setData({ remark1: '备注'})
                    } else {
                        that.setData({ remark1: res.data.data.promoter.remark ? res.data.data.promoter.remark : '备注'})
                    }
                } else {
                    app.catchFunc(res);
                }
            }
        })
    },

    getList: function () {
        var that = this;
        ajax.POST({
            url: '/m/promoterWx/get_wx',
            success: function (res) {
                if (res.data.success) {
                    let secList = res.data.data;
                    secList = secList.map((item) => {
                        if (item.entity.photo) {
                            let ph = JSON.parse(item.entity.photo);
                            console.log(ph)
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
                        secList: secList,
                    })
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
    },
    addSec: function () {
        wx.navigateTo({
            url: './addSec'
        })
    },
    navTo: function () {
        wx.navigateTo({
            url: './myInfo'
        })
    },
    delItem: function (e) {
        var that = this;
        let param = {
            id: e.currentTarget.dataset.info
        }
        wx.showModal({
            title: '提醒',
            content: '确认删除当前小秘书号?',
            success: function (res) {
                if (res.confirm) {
                    ajax.POST({
                        url: '/m/promoterWx/del',
                        data: param,
                        success: function (res) {
                            if (res.data.success) {
                                wx.showToast({
                                    title: '删除成功',
                                    color: '#fff',
                                    duration: 2000
                                })
                                that.getList();
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
                }
            }
        })
    },

    inputFun: function (e) {
        this.setData({
            remark: e.detail.value
        })
    },

    remarkFun: function (e) {
        console.log(e.currentTarget.dataset.remark)
        let id = e.currentTarget.dataset.id;
        let remarks = e.currentTarget.dataset.remark;
        this.setData({
            showFlag: true,
            id: id,
        })
        if (remarks == 'null' || remarks == 'undefined') {
            this.setData({ remarks: ''})
        } else {
            this.setData({ remarks: remarks })
        }

    },

    cancelFun: function () {
        this.setData({
            showFlag: false
        })
    },

    checkFun: function (para) {
        ajax.POST({
            url: '/m/promoterWx/update',
            data: para,
            success: function (res) {
                if (res.data.success) {
                    // that.setData({
                    //     showFlag: false,
                    // })
                    // if (that.data.id == 0) {
                    //     that.getInfo();
                    // } else {
                    //     that.getList();
                    // }
                } else {
                    app.catchFunc(res);
                }
            }
        })
    },

    saveFun: function () {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '确认修改备注？',
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                        showFlag: true,
                    })
                    let para = {
                        remark: that.data.remark,
                        stat: that.data.stat,
                        id: that.data.id
                    }
                    console.log(para)
                    ajax.POST({
                        url: '/m/promoterWx/update',
                        data: para,
                        success: function (res) {
                            if (res.data.success) {
                                that.setData({
                                    showFlag: false,
                                })
                                wx.showToast({
                                    title: '修改成功',
                                    icon: 'success',
                                    duration: 2000
                                })
                                if (that.data.id == 0) {
                                    that.getInfo();
                                } else {
                                    that.getList();
                                }
                                
                                
                            } else {
                                app.catchFunc(res);
                            }
                        }
                    })
                } else if (res.cancel) {
                    that.setData({
                        showFlag: false,
                    })
                }
            }
        })

    },

    changeSwitch: function (e) {
        let that = this;
        let index = e.currentTarget.dataset.idx;
        let account = e.currentTarget.dataset.account ? e.currentTarget.dataset.account : 0;
        let secList = this.data.secList;
        let id = e.currentTarget.dataset.id;
        let remark = e.currentTarget.dataset.remark;
        let stat = e.currentTarget.dataset.stat;
        if (account == 0) {
            wx.showModal({
                title: '提示',
                content: '您必须先去绑定微信',
            })
            secList[index].entity.accountStat = account;
            this.setData({
                secList: secList
            })
        } else if (account == 1) {
            wx.showModal({
                title: '提示',
                content: '此微信必须先去关注宝玩服务号',
            })
            secList[index].entity.accountStat = account;
            this.setData({
                secList: secList
            })
        } else {
            if (id == 0) {
                console.log(that.data.promoter.sendStat);
                if (that.data.promoter.sendStat == 0) {
                    let para = {
                        stat: 1,
                        id: 0,
                        remark: remark
                    }
                    that.checkFun(para);
                } else {
                    let para = {
                        stat: 0,
                        id: 0,
                        remark: remark
                    }
                    that.checkFun(para);
                }
                // that.getInfo();
            } else {
                let para = {
                    remark: remark,
                    id: id
                }
                if (stat == 0) {
                    para['stat'] = 1;
                } else {
                    para['stat'] = 0;
                }
                that.checkFun(para);
                // let para = {
                //     stat: 0,
                //     id: id,
                //     remark: remark
                // }
                // console.log(remark)
                // that.checkFun(para);
                // that.getList();
            }
            
        }
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        this.getInfo();
        this.getList();
    }
})