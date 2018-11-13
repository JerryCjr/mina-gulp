const app = getApp()
let mobile, password, account_type = 0;
let _authUserInfo = false, _authRec = false, url = '';
Page({
    data: {
        errorMsg: ''
    },
    checkMobile: function (e) {
        mobile = e.detail.value;
        // let reg = /^1[0-9]{10}$/;
        // if (!reg.test(mobile)) {
        //     mobile = undefined;
        //     wx.showToast({
        //         title: '手机号格式错误',
        //         icon: 'none',
        //         mask: true,
        //         duration: 2000
        //     });
        // } else {
        //     mobile: e.detail.value
        // }
    },
    inputPassword: function (e) {
        password = e.detail.value
    },
    submit: function () {
        let that = this
        let data = {
            mobile: mobile,
            account_type: account_type,
            password: password
        }
        if (mobile && password) {
            wx.request({
                url: app.globalData.host + '/api/user/login',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: data,
                method: 'POST',
                success: function (res) {
                    let data = res.data
                    if (data.success) {
                        wx.showToast({
                            title: '登录成功',
                            icon: 'success',
                            success: function () {
                                wx.redirectTo({
                                    url: '/pages/home/home',
                                })
                            }
                        })
                        wx.setStorageSync('token', data.data.token)
                        wx.setStorageSync('uid', data.data.user.id)
                        // that.globalData.userInfo.token = data.data.token
                        wx.reportAnalytics('s_login_success');
                    } else {
                        that.setData({
                            errorMsg: data.msg
                        })
                        setTimeout(function () {
                            that.setData({
                                errorMsg: ''
                            })
                        }, 2000)
                    }
                }
            })
        } else {
            let _input = mobile ? '密码' : '手机号'
            wx.showToast({
                title: "请输入" + _input,
                icon: 'none'
            })
        }
    },
    register: function () {
        let that = this
        let data = {
            mobile: mobile,
            account_type: account_type,
            password: password
        }
        if (mobile && password) {
            wx.request({
                url: app.globalData.host + '/api/user/login',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: data,
                method: 'POST',
                success: function (res) {
                    let data = res.data
                    if (data.success) {
                        wx.showToast({
                            title: '登录成功',
                            icon: 'success',
                            success: function () {
                                if (url == 'personal') {
                                    wx.navigateTo({
                                        url: '/pages/personal/personal',
                                    })
                                } else {
                                    wx.redirectTo({
                                        url: '../home/home',
                                    })
                                }
                                
                            }
                        })
                        wx.setStorageSync('token', data.data.token)
                        wx.setStorageSync('uid', data.data.user.id)
                        // that.globalData.userInfo.token = data.data.token
                        wx.reportAnalytics('s_login_success');
                    } else {
                        that.setData({
                            errorMsg: data.msg
                        })
                        setTimeout(function () {
                            that.setData({
                                errorMsg: ''
                            })
                        }, 2000)
                    }
                }
            })
        } else {
            let _input = mobile ? '密码' : '手机号'
            wx.showToast({
                title: "请输入" + _input,
                icon: 'none'
            })
        }
    },
    onLoad(options) {
        console.log(options)
        url = options.url;
        // if (options.url == 'personal') {
        //     wx.navigateTo({
        //         url: '/pages/personal/personal',
        //     })
        // }
    },

    onShow() {
        // if (!_authUserInfo) { this.authorityManage() }
    },

    // 认证管理
    authorityManage() {
        let _this = this
        wx.getSetting({
            success: function (res) {
                if (!res.authSetting['scope.userInfo']) {
                   
                }
            }
        })
    },

    getUserInfo() {
        wx.getUserInfo({
            success: res => {
                console.log(res)
                app.globalData.userInfo = res.userInfo
                app.globalData.wx_key = {
                    'iv': res.iv,
                    "encryptedData": res.encryptedData
                }
            }
        })
    },
    navTo: function (e) {
        if (e.target.dataset.handle === '0') {
            wx.navigateTo({
                url: '/pages/login/register?type=0',
            })
        } else {
            wx.navigateTo({
                url: '/pages/login/register?type=1',
            })
        }
        // console.log(e.target.dataset.handle)
    }
})