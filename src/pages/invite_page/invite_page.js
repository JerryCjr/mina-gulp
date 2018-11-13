// pages/invite_page/invite_page.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let id = '';
let times = new Date().getTime();
let c_id = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: '',
        top: 0,
        title: '',
        content: '',
        dialogFlag: true,
        types: '',
        flag: false,
    },

    popupFun: function (e) {
        id = e.currentTarget.dataset.id;
        this.setData({ dialogFlag: false})
        if (id == 1) {
            this.setData({
                title: '轻松推广 持续受益',
                content: '只负责邀请宝妈来体验课程，后期由专人维护，购课后获取相应收益',
                types: 1
            })
        } else {
            this.setData({
                title: '高付出 高回报',
                content: '负责邀请宝妈体验课程，并对其进行维护和后期销售，最终获取超高收益',
                types: 0
            })
        } 
    },

    closeFun: function () {
        this.setData({ dialogFlag: true })
    },

    getApply: function () {
        ajax.GET({
            url: '/promoter/apply/info',
            success: function (res) {
                console.log(res)
                if (res.data.success) {
                    if (res.data.data.status == 1 || res.data.data.status == -1) {
                        // wx.redirectTo({
                        //     url: '/pages/invite_page/invite_page',
                        // })
                        console.log('我没有身份')
                    } else if (res.data.data.status == 6) {
                        wx.redirectTo({
                            url: '/pages/train/trainList/trainList',
                        })
                    } else {
                        wx.redirectTo({
                            url: '/pages/recruit/audit',
                        })
                    }
                } else {
                    app.catchFunc(res);
                }
            }
        })
    },

    onReady: function () {
        let that = this;
        wx.getSystemInfo({
            success: function (res) {
                console.log(res);
                // 可使用窗口宽度、高度
                console.log('height=' + res.windowHeight);
                console.log('width=' + res.windowWidth);
                // 计算主体部分高度,单位为px
                if (res.windowHeight >= 724) {
                    that.setData({
                        flag: true,
                        url: '../../images/bg1.jpg',
                        top: 68
                    })
                } else {
                    that.setData({
                        flag: true,
                        url: '../../images/bg2.jpg',
                        top: 84
                    })
                }

            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        c_id = options.c_id;
    },

    submitFun: function () {
        let para = {
            user_name: '宝玩推广大使',
            mobile: 18888888888,
            nickname: '宝玩推广大使',
            wx_id: 'babyfs',
            mother_type: 0,
            type: 1,
            channel_id: c_id,
            pro: '',
            promoter_type: ''
        }

        ajax.POST({
            url: '/promoter/apply/submit',
            data: para,
            success: function (res) {
                console.log('submitFun' + res)
                if (res.data.success) {
                    wx.redirectTo({
                        url: '/pages/recruit/audit',
                    })
                } else {
                    app.catchFunc(res);
                }
            }
        })



    },

    getRegister: function (types) {
        let that = this;
        let para = {
            channel_id: c_id,
            pro: '',
            promoter_type: '',
            type: types
        }
        let ty = '';
        if (types == 0) {
            ty = 4;
        } else {
            ty = 6;
        }
        ajax.POST({
            url: '/promoter/apply/register',
            data: para,
            success: function (res) {
                console.log(res)
                that.getDate(ty);
            }
        })
    },

    getDate: function (types) {
        let that = this;
        let para = {
            type: types
        }
        let ty = '';
        if (types == 6) {
            ty = 1;
        } else {
            ty = 2; 
        }
        ajax.GET({
            url: '/promoter/apply/get/apply/date',
            data: para,
            success: function (res) {
                if (res.data.success) {
                    console.log(res)
                    if (res.data.data.startTime < times && res.data.data.endTime > times) {
                        if (ty == 1) {
                            console.log('submitFun');
                            that.submitFun();
                        } else {
                            wx.redirectTo({
                                url: '/pages/recruit/recruit?id=' + ty,
                            })
                        }
                        
                    } else {
                        wx.redirectTo({
                            url: '/pages/recruit/recruit_before',
                        })
                    }
                } else {
                    wx.redirectTo({
                        url: '/pages/recruit/recruit_before',
                    })
                }
            }
        })
    },

  registerFun: function (e) {
    wx.showLoading({
      title: '提交中...',
    });
    setTimeout(function () {
      wx.hideLoading();
    }, 1000);
        console.log(e.target.dataset.types)
        let types = e.target.dataset.types;
        this.getRegister(types);
        // wx.navigateTo({
        //     url: '/pages/recruit/recruit?id=' + id,
        // })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getApply();
    },

})