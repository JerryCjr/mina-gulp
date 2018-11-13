// pages/home/index/index.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let city = require('../../utils/city.js');
let provinces = [];
let idx0 = '';
let idx1 = '';
let idx2 = '';
Page({
  /**
   * 页面的初始数据
   */
    data: {
        promoter: [],
        actionSheetHidden: true,
        actionSheetItems: ['女', '男'],
        sex: '',
        actionSheetHiddens: true,
        actionWorkItems: ['全职妈妈', '班妈', '其他'],
        status: '',
        animationAddressMenu: {},
        addressMenuIsShow: false,
        value: [0, 0, 0],
        provinces: [],
        citys: [],
        areas: [],
        areaInfo: '',
        cityFlag: false,
        url: '',
        name : '',
        mobile : '',
        sex : '',
        bankId : '',
        bank : '',
        area : '',
        address : '',
        card: '',
        work: '',
        user: '',
        flag: ''
    },

    getInfo: function () {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        ajax.GET({
            url: '/m/promoter/info',
            success: function (res) {
                if (res.data.success) {
                    wx.hideLoading();
                    let data = res.data.data;
                    let promoter = data.promoter;
                    that.setData({
                        user: data.user,
                        promoter: promoter,
                        status: promoter.motherType ? promoter.motherType : '',
                        work: promoter.motherTypeName ? promoter.motherTypeName : '',
                        url: promoter.secretaryWxImgUrl ? promoter.secretaryWxImgUrl : '',
                        name: promoter.name ? promoter.name : '',
                        mobile: promoter.mobile ? promoter.mobile : '',
                        bankId: promoter.bankId ? promoter.bankId : '',
                        bank: promoter.bankSubbranch ? promoter.bankSubbranch : '',
                        card: promoter.idCard ? promoter.idCard : '',
                        address: promoter.address ? promoter.address : '',
                        area: promoter.addressAreaCode ? promoter.addressAreaCode : ''
                    })
                    that.switchSex(promoter.sex);
                    var address = JSON.parse(promoter.addressAreaCodeJson);
                    var addstr = [];
                    if (address) {
                        for (var i in address) {
                            addstr.push(address[i]);
                        }
                        if (addstr.length < 3) {
                            addstr.unshift(addstr[0]);
                        }
                        that.setData({
                            areaInfo: addstr
                        })
                    } else {
                        that.setData({
                            areaInfo: ['请选择', '请选择', '请选择']
                        })
                    }    
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.msg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },

    getDashiInfo: function () {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        ajax.GET({
            url: '/m/ambassador/info',
            success: function (res) {
                if (res.data.success) {
                    wx.hideLoading();
                    let data = res.data.data;
                    let ambassador = data.ambassador;
                    that.setData({
                        user: data.user,
                        promoter: ambassador,
                        status: ambassador.motherType ? ambassador.motherType : '',
                        work: ambassador.motherTypeName ? ambassador.motherTypeName : '',
                        url: ambassador.secretaryWxImgUrl ? ambassador.secretaryWxImgUrl : '',
                        name: ambassador.name ? ambassador.name : '',
                        mobile: ambassador.mobile ? ambassador.mobile : '',
                        bankId: ambassador.bankId ? ambassador.bankId : '',
                        bank: ambassador.bankSubbranch ? ambassador.bankSubbranch : '',
                        card: ambassador.idCard ? ambassador.idCard : '',
                        address: ambassador.address ? ambassador.address : '',
                        area: ambassador.addressAreaCode ? ambassador.addressAreaCode : ''
                    })
                    that.switchSex(ambassador.sex);
                    if (ambassador.addressAreaCodeJson) {
                        var address = JSON.parse(ambassador.addressAreaCodeJson);
                    }
                    var addstr = [];
                    if (address) {
                        for (var i in address) {
                            addstr.push(address[i]);
                        }
                        if (addstr.length < 3) {
                            addstr.unshift(addstr[0]);
                        }
                        that.setData({
                            areaInfo: addstr
                        })
                    } else {
                        that.setData({
                            areaInfo: ['请选择', '请选择', '请选择']
                        })
                    }
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.msg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },

    chooseImg: function(res) {
        wx.showLoading({
            title: '正在上传...',
        })
        let that = this;
        if (!new RegExp("(jpg|jpeg|gif|png)+", "gi").test(res.tempFilePaths)) {
            wx.showToast({
            title: "二维码上传：文件类型必须是JPG、JPEG、PNG或GIF!",
            color: '#fff',
            icon: 'none',
            duration: 2000
            })
            return;
        }
        let params = {
            bin: res.tempFiles[0]
        }
        wx.uploadFile({
            url: app.globalData.host + '/api/upload/pro/image', //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[0],
            name: 'bin',
            header: {
                'Content-Type': 'multipart/form-data',
                'X-Auth-Token': wx.getStorageSync('token')
            },
            success: function (res) {
                //do something
                if (res.statusCode === 200) {
                    var data = JSON.parse(res.data);
                    console.log(res)
                    if(data.success) {
                        wx.hideLoading();
                        that.setData({
                            url: data.data.url
                        })
                        wx.showToast({
                            title: "您的二维码审核成功,点击二维码一栏的“查看”，即可看到您的标准二维码",
                            color: '#fff',
                            icon: 'none',
                            duration: 2000
                        })
                    } else {
                        wx.hideLoading();
                        wx.showModal({
                            title: '错误',
                            content: '抱歉，您的二维码审核未通过，请重新上传，避免招生收到影响',
                            success: function() {

                            }
                        })
                    }
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.errMsg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    listenerButtonChooseImage: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            //original原图，compressed压缩图
            sizeType: ['original'],
            //album来源相册 camera相机 
            sourceType: ['album', 'camera'],
            //成功时会回调
            success: function (res) {
            //重绘视图
            that.setData({
                url: res.tempFilePaths[0]
            })
            that.chooseImg(res);
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
        if (s === '女') {
            this.setData({
                sex: 0
            })
        } else {
            this.setData({
                sex: 1
            })
        }

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
    switchSex: function (s) {
        var that = this;
        switch (s) {
            case 1:
            that.setData({
                sex: 1
            })
            break;
            case 0:
            that.setData({
                sex: 0
            })
            break;
            default:
            that.setData({
                sex: '请选择性别'
            })
        }
    },
    bindRegionChange: function (e) {
        console.log(e)
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
    //     idx0 = 0;
    //     idx1 = 0;
    //     idx2 = 0;
    //     that.setData({
    //         provinces: city.city,
    //         citys: city.city[0].ns
    //     })
    //     provinces = city.city;
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
    navTo: function () {
        wx.navigateTo({
            url: './checkecList'
        })
    },
    checkName: function (e) {
        this.setData({
            name : e.detail.value
        })
    },
    checkMobile: function (e) {
        this.setData({
            mobile: e.detail.value
        })
    },
    checkBankId: function (e) {
        this.setData({
            bankId: e.detail.value
        })
    },
    checkBank: function (e) {
        this.setData({
            bank: e.detail.value
        })
    },
    checkAddress: function (e) {
        this.setData({
            address: e.detail.value
        })
    },
    checkCard: function (e) {
        this.setData({
            card: e.detail.value
        })
    },
    submit: function () {
        let m = /^1[0-9]{10}$/;
        let userCardregFlag = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.card);
        let taiwanregFlag = /^[A-Z][0-9]{9}$/.test(this.data.card);
        let xianggangregFlag = /[A-Z]{1,2}[0-9]{6}\([0-9A]\)$/.test(this.data.card);
        let aomenregFlag = /^[157][0-9]{6}\([0-9]\)$/.test(this.data.card);
        let tongxingzhengFlag = /^[HMhm][0-9]{10}$/.test(this.data.card);
        if (!m.test(this.data.mobile) && this.data.mobile.length !== 0) {
            wx.showToast({
                title: '手机号输入不正确',
                color: '#fff',
                icon: 'none',
                duration: 2000
            })
            return
        }
        if (this.data.bankId && /^\d{15,20}$/.test(this.data.bankId)) { } else {
            wx.showToast({
                title: '请输入正确的银行卡号',
                color: '#fff',
                icon: 'none',
                duration: 2000
            })
            return
        }
        if (this.data.card && (userCardregFlag || taiwanregFlag || xianggangregFlag || aomenregFlag || tongxingzhengFlag)) { } else {
            wx.showToast({
                title: '请输入正确的身份证号',
                color: '#fff',
                icon: 'none',
                duration: 2000
            })
            return
        }
        let para = {};
        let url = '';
        if (this.data.flag == 'true') {
            url = '/m/promoter/update';
            para = {
                name: this.data.name,
                mobile: this.data.mobile,
                sex: this.data.sex,
                bank_id: this.data.bankId,
                bank_branch: this.data.bank,
                id_card: this.data.card,
                adress_code: this.data.area,
                adress: this.data.address,
                mother_type: this.data.status,
                url: this.data.url
            }
        } else {
            url = '/m/amb/update'
            para = {
                name: this.data.name,
                mobile: this.data.mobile,
                sex: this.data.sex,
                bank_id: this.data.bankId,
                bank_branch: this.data.bank,
                id_card: this.data.card,
                adress_code: this.data.area,
                adress: this.data.address,
                mother_type: this.data.status,
            }
        }
        ajax.POST({
            url: url,
            data: para,
            success: function (res) {
                if (res.data.success) {
                    wx.showToast({
                        title: '修改成功',
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
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
        console.log(options.flag)
        this.setData({ flag: options.flag });
        if (options.flag == 'true') {
            this.getInfo();
        } else {
            this.getDashiInfo();
        }
        
        // this.getCity();
    },
})