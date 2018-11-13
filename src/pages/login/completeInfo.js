// pages/home/index/index.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let provinces = [];
let idx0 = '';
let idx1 = '';
let idx2 = '';
let flag = false;

Page({
  /**
   * 页面的初始数据
   */
    data: {
        promoter: [],
        actionSheetHidden: true,
        actionSheetItems: ['是', '否'],
        actionSheetHiddens: true,
        actionWorkItems: ['全职妈妈', '班妈'],
        status: '',
        animationAddressMenu: {},
        addressMenuIsShow: false,
        value: [0, 0, 0],
        provinces: [],
        citys: [],
        areas: [],
        areaInfo: ['北京市', '北京市', '东城区'],
        cityFlag: false,
        name : '',
        mobile: '',
        buy_mobile : '',
        sex : '',
        area: 110101,
        work: '',
        pro: ''
    },
    getInfo: function () {
        var that = this;
        ajax.GET({
            url: '/m/promoter/info3',
            success: function (res) {
                if (res.data.success) {
                    let user = res.data.data.user;
                    that.setData({
                        mobile: user.mobile
                    })
                    // if (res.data.data.apply) { // 如果存在 apply 实体。则说明是提交了审核在审核状态中
                    //     wx.navigateTo({
                    //         url: '/pages/login/statPage'
                    //     })
                    // } else 
                    if (res.data.data.promoter) { // 如果存在 promoter 实体。则说明是审核通过成为了一个推广人
                        wx.navigateTo({
                            url: '/pages/home/home'
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: function (err) {

            }
        })
    },
    listenerButtonSex: function () {
        this.setData({
            //取反
            actionSheetHidden: !this.data.actionSheetHidden
        });
        },
    listenerActionSheet: function () {
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    chooseSex: function (e) {
        var s = e.currentTarget.dataset.sex;
        this.setData({
            sex: s
        })
        this.setData({
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    listenerActionSheets: function () {
        this.setData({
            actionSheetHiddens: !this.data.actionSheetHiddens
        })
    },
    listenerButtonWork: function () {
        this.setData({
            //取反
            actionSheetHiddens: !this.data.actionSheetHiddens
        });
    },
    chooseWork: function (e) {
        var w = e.currentTarget.dataset.work;
        this.setData({
            work: w
        })
        if (w === '全职妈妈') {
            this.setData({
                status: 0
            })
        } else if (w === '班妈') {
            this.setData({
                status: 1
            })
        } else {
            this.setData({
                status: 2
            })
        }

        this.setData({
            actionSheetHiddens: !this.data.actionSheetHiddens
        })
    },
    bindRegionChange: function (e) {
        console.log(e.detail.code[2])
        this.setData({
            areaInfo: e.detail.value,
            area: e.detail.code[2]
        })
    },
    // cityShow: function () {
    //     this.setData({
    //         addressMenuIsShow: true
    //     })
    // },
    // cityCancel: function () {
    //     this.setData({
    //         addressMenuIsShow: false
    //     })
    // },
    // getCity: function () {
    //     var that = this;
    //     wx:wx.request({
    //         url: 'https://s0.babyfs.cn/m/static/json/area.min.json',
    //         method: 'GET',
    //         dataType: 'json',
    //         responseType: 'text',
    //         success: function(res) {
    //             idx0 = 0;
    //             idx1 = 0;
    //             idx2 = 0;
    //             that.setData({
    //                 provinces: res.data,
    //                 citys: res.data[0].ns
    //             })
    //             provinces = res.data;
    //         },
    //         fail: function(res) {
    //             wx.showToast({
    //                 title: res.data.msg,
    //                 color: '#fff',
    //                 icon: 'none',
    //                 duration: 2000
    //             })
    //         },
    //     })
    // },
    // cityChange: function (e) {
    //     idx0 = e.detail.value[0];
    //     idx1 = e.detail.value[1];
    //     idx2 = e.detail.value[2];
    //     if (!provinces[idx0].ns[idx1].ns) {
    //         this.setData({
    //             citys: provinces[idx0].ns,
    //             areas: []
    //         })
    //     } else {
    //         this.setData({
    //             citys: provinces[idx0].ns,
    //             areas: provinces[idx0].ns[idx1].ns
    //         })
    //     }
    // },
    // 点击地区选择确定按钮
    // citySure: function (e) {
    //     var that = this;
    //     var city = that.data.city;
    //     // that.startAddressAnimation(false);
    //     var areaInfo = '';
    //     // 将选择的城市信息显示到输入框
    //     if (provinces[idx0].ns[idx1].ns) {
    //         areaInfo = that.data.provinces[idx0].n + '-' + that.data.citys[idx1].n + '-' + that.data.citys[idx1].ns[idx2].n;
    //         that.setData({
    //             areaInfo: areaInfo,
    //             area: that.data.citys[idx1].ns[idx2].c
    //         })
    //     } else {
    //         areaInfo = that.data.provinces[idx0].n + '-' + that.data.citys[idx1].n + '-' + that.data.citys[idx1].n;
    //         that.setData({
    //             areaInfo: areaInfo,
    //             area: that.data.citys[idx1].c
    //         })
    //     }
    //     this.setData({
    //         addressMenuIsShow: false
    //     })
    // },
    checkName: function (e) {
        this.setData({
            name : e.detail.value
        })
    },
    checkMobile: function (e) {
        this.setData({
            buy_mobile: e.detail.value
        })
    },
    checkPro: function (e) {
        this.setData({
            pro: e.detail.value
        })
    },
    submit: function () {
        let m = /^[1][3,4,5,6,7,8][0-9]{9}$/;
        if (!this.data.name.trim()) {
            wx.showToast({
                title: '请输入姓名',
                color: '#fff',
                icon: 'none',
                duration: 2000
            })
            return
        }
        if (!m.test(this.data.buy_mobile)) {
            wx.showToast({
                title: '手机号输入不正确',
                color: '#fff',
                icon: 'none',
                duration: 2000
            })
            return
        }
        if (!this.data.area) {
            wx.showToast({
                title: '请选择您所在的区域',
                color: '#fff',
                icon: 'none',
                duration: 2000
            })
            return
        }
        if (!this.data.sex) {
            wx.showToast({
                title: '请回复工作时长相关问题',
                color: '#fff',
                icon: 'none',
                duration: 2000
            })
        }
        if (!this.data.work) {
            wx.showToast({
                title: '请选择工作状态',
                color: '#fff',
                icon: 'none',
                duration: 2000
            })
        }
        let para = {
            user_name: this.data.name,
            mobile: this.data.buy_mobile,
            pro: this.data.pro,
            mother_type: this.data.status,
            time_than: this.data.sex,
            area: this.data.area,
            channel_id: 2,
        }
        if (flag) {
            para['re_apply'] = 1
        }
        ajax.POST({
            url: '/m/promoter/apply',
            data: para,
            success: function (res) {
                if (res.data.success) {
                    console.log(11)
                    wx.showToast({
                        title: '申请成功，请等待审核。',
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                    wx.redirectTo({
                        url: '/pages/login/statPage',
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
    // 查看图片
    checkImg: function () {
        let that = this;
        if (that.data) {
            wx.previewImage({
                current: that.data.url,
                urls: [that.data.url]
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInfo();
        flag = options.reApply;
        // this.getCity();
    },
})