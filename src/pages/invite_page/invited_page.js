// pages/invite_page/invite_page.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let id = '';
let authSetting = '';
let invite_id = '';
let pt = '';
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
        types: 2,
        info_top: 0,
        loginFlag: true,
        invite: '',
        modalFlag: false
    },

    getSessionid: function() {
        let that = this;
        console.log('session_id111111')
        console.log('session_id: ' + wx.getStorageSync('session_id'));
        if (wx.getStorageSync('session_id')) {
            that.getUserInfo(that.getManager);
        } else {
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    wx.request({
                        url: app.globalData.host + '/api/user/wxx_session',
                        data: {
                            wx_js_code: res.code,
                            wx_app: 'wxa_pro'
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST',
                        success: function(res) {
                            if (res.data.success) {
                                console.log(res)
                                console.log('session_id')
                                wx.setStorageSync('session_id', res.data.data.session_id);
                                that.getUserInfo(that.getManager);
                            }
                        },
                        fail: function(res) {},
                        complete: function(res) {},
                    })
                }
            })
        }

    },

    getAuthSetting: function() {
        let that = this;
        console.log('start getAuthSetting');
        wx.getSetting({
            success: function success(res) {
                console.log(res)
                console.log('scope.userInfo')
                if (res.authSetting['scope.userInfo']) {
                    // that.getUserInfo();
                    console.log('userinfo: true');
                    
                    that.setData({
                        loginFlag: true,
                        modalFlag: false
                    })
                    that.getSessionid();

                } else {
                    console.log('userinfo: false');
                    that.setData({
                        loginFlag: false,
                    })
                }
            }
        });

    },

    getUserInfo: function(callback) {
        var that = this;
        wx.getUserInfo({
            success: res => {
                app.globalData.userInfo = res.userInfo;
                app.globalData.iv = res.iv;
                app.globalData.encryptedData = res.encryptedData;
                if (callback) {
                    that.loginBabyfs(callback);
                }
                that.getManager();
            }
        })
    },

    loginBabyfs: function(callback) {
        var that = this;
        console.log(wx.getStorageSync('token'))
        console.log('token')
        if (wx.getStorageSync('token')) {
            if (callback) {
                callback();
            }
        } else {
            var data = {
                wx_session_id: wx.getStorageSync('session_id'),
                wx_encrypted_data: app.globalData.encryptedData,
                wx_iv: app.globalData.iv
            }
            wx.request({
                url: app.globalData.host + '/api/user/wxx_login',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: data,
                method: 'POST',
                success: function(res) {
                    var data = res.data
                    if (data.success) {
                        console.log(data.data.token)
                        wx.setStorageSync('token', data.data.token);
                        wx.setStorageSync('uid', data.data.user.id);
                        if (callback) {
                            callback();
                        }
                    } else {
                        wx.showModal({
                            title: '失败:' + data.code,
                            content: data.msg,
                            showCancel: false
                        })
                    }
                },
                fail: function(res) {

                }
            })
        }
    },

    linkToPersonal: function() {
        var that = this;
        wx.getSetting({
            success: function success(res) {
                authSetting = res.authSetting;
                if (authSetting['scope.userInfo'] === false) {
                    that.setData({ modalFlag: true })
                    // wx.showModal({
                    //     title: '用户未授权',
                    //     content: '请点击“确定”并在授权管理中开启“用户信息”后，返回即可正常参加活动',
                    //     showCancel: false,
                    //     success: function(res) {
                    //         if (res.confirm) {
                                
                    //             wx.openSetting({
                    //                 success: function success(res) {
                    //                     if (res.authSetting['scope.userInfo']) {
                    //                         console.log('scope.userInfo true')
                    //                         that.setData({
                    //                             loginFlag: false,
                    //                         })
                    //                         that.getUserInfo(that.getManager);
                    //                     }
                    //                 }
                    //             });
                    //         }
                    //     }
                    // })
                } else {
                    console.log('scope.userInfo false')
                    that.setData({
                        loginFlag: true,
                        modalFlag: false
                    })
                    that.getUserInfo(that.getManager);
                }
            }
        })
    },

    getManager: function() {
        let that = this;
        ajax.GET({
            url: '/user/profile',
            success: function(res) {
                if (res.data.success) {
                    console.log(res.data.data.user)
                    if (res.data.data.user.mobile) {
                        // that.getInfo();
                    } else {
                        wx.redirectTo({
                            url: '/pages/login/bindMobile?types=' + that.data.types + '&invite_id=' + invite_id + '&pt=' + pt + '&c_id=' + c_id,
                        })
                    }
                } else {
                    // app.catchFunc(res);
                }
            }
        })
    },

    getInfo: function() {
        let that = this;
        ajax.GET({
            url: '/promoter/center/info',
            success: function(res) {
                console.log('center/info')
                console.log(res)
                if (res.data.success) {
                    if (res.data.data == 5) {
                        that.getDashi();
                    } else if (res.data.data == 1) {
                        that.getGuwen();
                    } else {
                        that.getApply();

                    }
                } else {
                    // app.catchFunc(res);
                }
            }
        })
    },

    getGuwen: function() {
        wx.showModal({
            title: '提示',
            content: '您已是启蒙顾问',
            success: function(res) {
                if (res.confirm) {
                    wx.redirectTo({
                        url: '/pages/home/home?id=' + 2,
                    })
                } else if (res.cancel) {
                    wx.redirectTo({
                        url: '/pages/home/home?id=' + 2,
                    })
                }
            }
        })
    },

    getDashi: function() {
        wx.showModal({
            title: '提示',
            content: '您已是推广大使',
            success: function(res) {
                if (res.confirm) {
                    wx.redirectTo({
                        url: '/pages/home/home?id=' + 1,
                    })
                } else if (res.cancel) {
                    wx.redirectTo({
                        url: '/pages/home/home?id=' + 1,
                    })
                }
            }
        })
    },

    getApply: function() {
        let that = this;
        ajax.GET({
            url: '/promoter/apply/info',
            success: function(res) {
                console.log(res)
                if (res.data.success) {
                    if (res.data.data.status == 1 || res.data.data.status == -1) {
                        that.getregister();
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
                    // app.catchFunc(res);
                }
            }
        })
    },

    submitFun: function() {
        let para = {
            user_name: '宝玩推广大使',
            mobile: 18888888888,
            nickname: '宝玩推广大使',
            wx_id: 'babyfs',
            mother_type: 0,
            type: 1,
            channel_id: c_id,
            pro: invite_id,
            promoter_type: pt
        }

        ajax.POST({
            url: '/promoter/apply/submit',
            data: para,
            success: function(res) {
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

  popupFun: function (e) {
    wx.showLoading({
      title: '提交中...',
    });
    setTimeout(function () {
      wx.hideLoading();
    }, 1000);
        console.log(pt)
        this.getInfo();
        id = e.currentTarget.dataset.id;
        

    },

    getregister: function () {
        let that = this;
        let para = {
            channel_id: c_id,
            pro: invite_id,
            promoter_type: pt,
            type: id
        }

        console.log('register')
        ajax.POST({
            url: '/promoter/apply/register',
            data: para,
            success: function (res) {
    
            }
        })
        if (id == 1) {
            that.submitFun();
        } else {
            wx.redirectTo({
                url: '/pages/recruit/recruit?id=' + id + '&invite_id=' + invite_id + '&pt=' + pt + '&c_id=' + c_id,
            })
        }
    },

    getName: function() {
        wx.showLoading({
            title: '加载中...',
        })
        let that = this;
        let para = {
            i: invite_id
        }
        wx.request({
            url: app.globalData.host + '/api/promoter/apply/invite_name',
            method: 'GET',
            data: {
                i: invite_id
            },
            success: function(res) {
                console.log(9999999)
                if (res.data.success) {
                    wx.hideLoading();
                    that.setData({
                        invite: res.data.data
                    })
                } else {
                    wx.hideLoading();
                    app.catchFunc(res);
                }
            },

        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let tS = ''
        console.log(decodeURIComponent(options.scene).split(','))
        console.log(options.scene)
        if (options.scene) {
            let scene = decodeURIComponent(options.scene).split(',');
            scene.map((item) => {
                if (item.split('=')[0] == 't') {
                    // console.log(item.split('=')[1])
                    tS = item.split('=')[1];
                    that.setData({
                        types: tS
                    });
                }

                if (item.split('=')[0] == 'c') {
                    c_id = item.split('=')[1]
                }

                if (item.split('=')[0] == 'pt') {
                    pt = item.split('=')[1]
                }

                if (item.split('=')[0] == 'i') {
                    invite_id = item.split('=')[1]
                }
            })
        } else {
            invite_id = options.invite_id ? options.invite_id : '';
            pt = options.pt ? options.pt : '';
            c_id = options.c_id ? options.c_id : '';
            this.setData({ types: options.types ? options.types : '' });
        }
        
        wx.getSystemInfo({
            success: function(res) {
                console.log(res);
                // 可使用窗口宽度、高度
                console.log('height=' + res.windowHeight);
                console.log('width=' + res.windowWidth);
                if (res.windowHeight >= 960) {
                    that.setData({
                        info_top: 74
                    })
                } else {
                    that.setData({
                        info_top: 160
                    })
                }
                if (that.data.types == 1) {
                    // 计算主体部分高度,单位为px
                    if (res.windowHeight >= 724) {
                        that.setData({
                            url: '../../images/dashi2.jpg',
                            top: 68
                        })
                    } else {
                        that.setData({
                            url: '../../images/dashi1.jpg',
                            top: 84
                        })
                    }
                } else {
                    // 计算主体部分高度,单位为px
                    if (res.windowHeight >= 724) {
                        that.setData({
                            url: '../../images/guwen2.jpg',
                            top: 68
                        })
                    } else {
                        that.setData({
                            url: '../../images/guwen1.jpg',
                            top: 84
                        })
                    }
                }


            }
        })
    },

    registerFun: function() {
        wx.redirectTo({
            url: '/pages/recruit/recruit?id=' + id,
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getName();
        this.getAuthSetting();
    },
})