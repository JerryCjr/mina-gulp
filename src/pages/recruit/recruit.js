// pages/recruit/recruit.js
const app = getApp();
let city = require('../../utils/city.js');
let ajax = require('../../utils/ajax.js');
let provinces = [];
let idx0 = '';
let idx1 = '';
let idx2 = '';
let pro_name = '', pro_phone = '', pro_wechatn = '', pro_wechatm = '';
let id = '', channel_id = '', pro = '', mother_type = -1, is_buy_classic = -1, buy_class_phone = '';
let invite_id = '';
let pt = '';
let c_id = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        actionSheetHidden: true,
        actionWorkHidden: true,
        actionRoleHidden: true,
        actionNumHidden: true,
        actionSheetItems: ['6小时以上', '4~6小时', '2~4小时', '2小时以下'],
        actionWorkItems: ['微商', '教师', '公务员', '销售', '其他'],
        actionRoleItems: ['精品班学员', '班长', '大班长', '其他'],
        actionNumItems: ['0~200', '200~500', '500以上'],
        areaInfo: '选择地区',
        animationAddressMenu: {},
        addressMenuIsShow: false,
        value: [0, 0, 0],
        provinces: [],
        citys: [],
        areas: [],
        cityFlag: false,
        buyFlag: '',
        roleFlag: false,
        time_than: '请选择时间',
        friend_num: '请选择好友数目',
        job: '请选择职业',
        flag: false,
    },

    checkbuyPhone: function (e) {
        buy_class_phone = e.detail.value;
    },

    checkProName: function (e) {
        pro_name = e.detail.value;
    },

    checkProPhone: function (e) {
        pro_phone = e.detail.value;
    },

    checkProWechatn: function (e) {
        pro_wechatn = e.detail.value;
    },

    checkProWechatm: function (e) {
        pro_wechatm = e.detail.value;
    },

    listenerButtonTime: function () {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    listenerButtonWork: function () {
        this.setData({
            actionWorkHidden: !this.data.actionWorkHidden
        })
    },
    listenerButtonRole: function () {
        this.setData({
            actionRoleHidden: !this.data.actionRoleHidden
        })
    },
    listenerButtonNum: function () {
        this.setData({
            actionNumHidden: !this.data.actionNumHidden
        })
    },
    listenerActionSheet: function () {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    listenerActionWork: function () {
        this.setData({
            actionWorkHidden: !this.data.actionWorkHidden
        })
    },
    listenerActionRole: function () {
        this.setData({
            actionRoleHidden: !this.data.actionRoleHidden
        })
    },
    listenerActionNum: function () {
        this.setData({
            actionNumHidden: !this.data.actionNumHidden
        })
    },
    choiceTime: function (e) {
        this.setData({ time_than: e.currentTarget.dataset.val})
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    choiceWork: function (e) {
        this.setData({ job: e.currentTarget.dataset.val })
        this.setData({
            actionWorkHidden: !this.data.actionWorkHidden
        })
    },
    choiceRole: function () {
        this.setData({
            actionRoleHidden: !this.data.actionRoleHidden
        })
    },
    choiceNum: function (e) {
        this.setData({ friend_num: e.currentTarget.dataset.val })
        this.setData({
            actionNumHidden: !this.data.actionNumHidden
        })
    },
    cityShow: function () {
        this.setData({
            addressMenuIsShow: true,
            flag: true
        })
    },
    cityCancel: function () {
        console.log(999)
        this.setData({
            addressMenuIsShow: false,
            flag: false
        })
    },
    getCity: function () {
        var that = this;
        idx0 = 0;
        idx1 = 0;
        idx2 = 0;
        that.setData({
            provinces: city.city,
            citys: city.city[0].ns
        })
        provinces = city.city;
    },
    cityChange: function (e) {
        idx0 = e.detail.value[0];
        idx1 = e.detail.value[1];
        idx2 = e.detail.value[2];
        if (!provinces[idx0].ns[idx1].ns) {
            this.setData({
                citys: provinces[idx0].ns,
                areas: []
            })
        } else {
            this.setData({
                citys: provinces[idx0].ns,
                areas: provinces[idx0].ns[idx1].ns
            })
        }
    },
    // 点击地区选择确定按钮
    citySure: function (e) {
        var that = this;
        var city = that.data.city;
        // that.startAddressAnimation(false);
        var areaInfo = '';
        // 将选择的城市信息显示到输入框
        if (provinces[idx0].ns[idx1].ns) {
            areaInfo = that.data.provinces[idx0].n + '-' + that.data.citys[idx1].n + '-' + that.data.citys[idx1].ns[idx2].n;
            that.setData({
                areaInfo: areaInfo,
                area: that.data.citys[idx1].ns[idx2].c
            })
        } else {
            areaInfo = that.data.provinces[idx0].n + '-' + that.data.citys[idx1].n + '-' + that.data.citys[idx1].n;
            that.setData({
                areaInfo: areaInfo,
                area: that.data.citys[idx1].c
            })
        }
        console.log(88988)
        this.setData({
            addressMenuIsShow: false,
            flag: false
        })
    },
    radioChange: function (e) {
        if (e.detail.value === '是') {
            is_buy_classic = 1;
            this.setData({
                buyFlag: 1
            })
        } else {
            is_buy_classic = 0;
            this.setData({
                buyFlag: 2
            })
        }
    },
    motherTypeChange: function (e) {
        console.log(e.detail.value)
        mother_type = e.detail.value;
    },
    submitFun: function () {
        let that = this;
        wx.showLoading({
            title: '提交中...',
        })
        this.setData({ disflag: true });
        let reg = /^1[0-9]{10}$/;
        let para = {};
        if (!pro_name.trim()) {
            wx.showToast({
                title: '您填写的姓名不能为空',
                icon: 'none'
            })
            return
        }

        if (!pro_phone.trim()) {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'none'
            });
            return
        } else if (!reg.test(pro_phone)) {
            wx.showToast({
                title: '手机号格式错误',
                icon: 'none'
            });
            return
        }

        if (!pro_wechatn.trim()) {
            wx.showToast({
                title: '您填写的微信昵称不能为空',
                icon: 'none'
            })
            return
        }

        if (!pro_wechatm.trim()) {
            wx.showToast({
                title: '您填写的微信号不能为空',
                icon: 'none'
            })
            return
        }
        if (id == 1) {
            para = {
                user_name: pro_name,
                mobile: pro_phone,
                nickname: pro_wechatn,
                wx_id: pro_wechatm,
                mother_type: mother_type,
                type: 1,
                channel_id: c_id,
                pro: invite_id,
                promoter_type: pt
            }
            if (mother_type == 0 || mother_type == 1 || mother_type == 2) {
            } else {
                wx.showToast({
                    title: '您未选择职称',
                    icon: 'none'
                })
                return
            }
        } else {
            para = {
                user_name: pro_name,
                mobile: pro_phone,
                nickname: pro_wechatn,
                wx_id: pro_wechatm,
                area: this.data.area,
                time_than: this.data.time_than,
                job: this.data.job,
                friend_num: this.data.friend_num,
                is_buy_classic: is_buy_classic,
                buy_class_phone: buy_class_phone,
                type: 0,
                channel_id: c_id,
                pro: invite_id,
                promoter_type: pt
            }
            if (!this.data.area) {
                wx.showToast({
                    title: '您未选择所在地区',
                    icon: 'none'
                })
                return
            }

            if (this.data.time_than == '请选择时间') {
                wx.showToast({
                    title: '您未选择时间',
                    icon: 'none'
                })
                return
            }

            if (this.data.job == '请选择职业') {
                wx.showToast({
                    title: '您未选择职业',
                    icon: 'none'
                })
                return
            }

            if (this.data.friend_num == '请选择好友数目') {
                wx.showToast({
                    title: '您未选择好友数目',
                    icon: 'none'
                })
                return
            }
            console.log(is_buy_classic)
            if (is_buy_classic == 0 || is_buy_classic == 1) {
            } else {
                wx.showToast({
                    title: '您未选择是否购买过精品课',
                    icon: 'none'
                })
                return
            }

            if (is_buy_classic == 1 && !reg.test(buy_class_phone)) {
                wx.showToast({
                    title: '购课手机号格式错误',
                    icon: 'none'
                });
                return
            }
            console.log(para)
        }
        
        ajax.POST({
            url: '/promoter/apply/submit',
            data: para,
            success: function (res) {
                if (res.data.success) {
                    wx.hideLoading();
                    if (id == 1) {
                        // wx.redirectTo({
                        //     url: '/pages/train/trainList/trainList',
                        // })
                        wx.redirectTo({
                            url: '/pages/recruit/audit',
                        })
                    } else {
                        wx.redirectTo({
                            url: '/pages/recruit/audit',
                        })
                    }
                } else {
                    wx.hideLoading();
                    app.catchFunc(res);
                }
            }
        })
        

        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.id)
        id = options.id;
        invite_id = options.invite_id;
        pt = options.pt;
        c_id = options.c_id;
        if (id == 1) {
            this.setData({
                roleFlag: false
            })
        } else {
            this.setData({
                roleFlag: true
            })
        }
        this.getCity();
    },
})